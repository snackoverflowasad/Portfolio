import type {
  AdminAuthLoginResponse,
  AdminAuthUser,
  AdminBlog,
  AdminBlogPayload,
  AdminMessage,
  AdminProject,
  AdminProjectPayload,
  ItemStatus,
} from '../types'

const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '').replace(/\/+$/, '')
const TOKEN_STORAGE_KEY = import.meta.env.TOKEN_KEY

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

function toObject(value: unknown) {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>
  }

  return null
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function unwrapList(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload.map((item) => toObject(item)).filter((item): item is Record<string, unknown> => item !== null)
  }

  const root = toObject(payload)
  if (!root) {
    return []
  }

  const data = toObject(root.data)
  const candidates = [
    root.items,
    root.projects,
    root.blogs,
    root.results,
    root.data,
    data?.items,
    data?.projects,
    data?.blogs,
    data?.results,
    data?.data,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map((item) => toObject(item)).filter((item): item is Record<string, unknown> => item !== null)
    }
  }

  return []
}

function unwrapEntity(payload: unknown) {
  const root = toObject(payload)
  if (!root) {
    return null
  }

  const data = toObject(root.data)
  const candidates = [root.item, root.project, root.blog, data?.item, data?.project, data?.blog, data, root]

  for (const candidate of candidates) {
    const node = toObject(candidate)
    if (node) {
      return node
    }
  }

  return null
}

function read(node: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (node[key] !== undefined) {
      return node[key]
    }
  }

  return undefined
}

function normalizeAdminProject(node: Record<string, unknown>): AdminProject {
  return {
    id: String(read(node, 'id', '_id') ?? ''),
    slug: String(read(node, 'slug') ?? ''),
    title: String(read(node, 'title') ?? ''),
    summary: read(node, 'summary') ? String(read(node, 'summary')) : undefined,
    description: read(node, 'description') ? String(read(node, 'description')) : undefined,
    projectUrl: read(node, 'projectUrl') ? String(read(node, 'projectUrl')) : undefined,
    liveUrl: read(node, 'liveUrl') ? String(read(node, 'liveUrl')) : undefined,
    repositoryUrl: read(node, 'repositoryUrl') ? String(read(node, 'repositoryUrl')) : undefined,
    techStack: normalizeStringArray(read(node, 'techStack')),
    imageUrl: read(node, 'imageUrl') ? String(read(node, 'imageUrl')) : undefined,
    status: String(read(node, 'status') ?? 'draft') as ItemStatus,
    featured: Boolean(read(node, 'featured')),
  }
}

function normalizeAdminBlog(node: Record<string, unknown>): AdminBlog {
  return {
    id: String(read(node, 'id', '_id') ?? ''),
    slug: String(read(node, 'slug') ?? ''),
    title: String(read(node, 'title') ?? ''),
    summary: read(node, 'summary') ? String(read(node, 'summary')) : undefined,
    contentMarkdown: read(node, 'contentMarkdown') ? String(read(node, 'contentMarkdown')) : undefined,
    href: read(node, 'href', 'externalUrl') ? String(read(node, 'href', 'externalUrl')) : undefined,
    coverImageUrl: read(node, 'coverImageUrl') ? String(read(node, 'coverImageUrl')) : undefined,
    category: read(node, 'category') ? String(read(node, 'category')) : undefined,
    tags: normalizeStringArray(read(node, 'tags')),
    status: String(read(node, 'status') ?? 'draft') as ItemStatus,
    featured: Boolean(read(node, 'featured')),
  }
}

function normalizeAdminMessage(node: Record<string, unknown>): AdminMessage {
  return {
    id: String(read(node, 'id', '_id') ?? ''),
    senderName: String(read(node, 'senderName', 'name', 'fullName', 'sender') ?? 'Anonymous'),
    senderEmail: String(read(node, 'senderEmail', 'email', 'replyTo') ?? ''),
    inquiryType: String(read(node, 'inquiryType', 'type', 'category') ?? 'General'),
    subject: String(read(node, 'subject', 'title') ?? 'New message'),
    message: String(read(node, 'message', 'body', 'content', 'text') ?? ''),
    receivedAt: String(read(node, 'receivedAt', 'createdAt', 'submittedAt', 'created_at') ?? ''),
    status: String(read(node, 'status', 'state') ?? 'unread') === 'read' ? 'read' : 'unread',
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    const text = await response.text()
    return (text as unknown) as T
  }

  const text = await response.text()
  if (!text.trim()) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

function getAuthHeaders(token: string, isJson = true) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }

  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

function formDataFromProject(payload: AdminProjectPayload, imageFile?: File | null) {
  const data = new FormData()
  data.append('title', payload.title)
  data.append('summary', payload.summary ?? '')
  data.append('description', payload.description ?? '')
  data.append('projectUrl', payload.projectUrl ?? '')
  data.append('liveUrl', payload.liveUrl ?? '')
  data.append('repositoryUrl', payload.repositoryUrl ?? '')
  data.append('techStack', JSON.stringify(payload.techStack))
  data.append('imageUrl', payload.imageUrl ?? '')
  data.append('status', payload.status)
  data.append('featured', String(payload.featured))

  if (imageFile) {
    data.append('image', imageFile)
  }

  return data
}

function formDataFromBlog(payload: AdminBlogPayload, imageFile?: File | null) {
  const data = new FormData()
  data.append('title', payload.title)
  data.append('summary', payload.summary ?? '')
  data.append('contentMarkdown', payload.contentMarkdown ?? '')
  data.append('href', payload.href ?? '')
  data.append('category', payload.category ?? '')
  data.append('tags', JSON.stringify(payload.tags))
  data.append('coverImageUrl', payload.coverImageUrl ?? '')
  data.append('status', payload.status)
  data.append('featured', String(payload.featured))

  if (imageFile) {
    data.append('image', imageFile)
  }

  return data
}

export function saveAdminToken(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function getSavedAdminToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function loginAdmin(email: string, password: string) {
  const payload = await request<unknown>('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const node = toObject(payload)
  const data = toObject(node?.data)
  const token = String(node?.accessToken ?? data?.accessToken ?? '')
  const userNode = toObject(node?.user ?? data?.user)

  if (!token) {
    throw new Error('Login succeeded but no access token was returned.')
  }

  const result: AdminAuthLoginResponse = {
    accessToken: token,
    user: userNode
      ? {
          id: String(userNode.id ?? userNode._id ?? ''),
          email: String(userNode.email ?? ''),
          role: String(userNode.role ?? 'admin'),
        }
      : undefined,
  }

  return result
}

export async function getAdminMe(token: string) {
  const payload = await request<unknown>('/api/admin/auth/me', {
    method: 'GET',
    headers: getAuthHeaders(token, false),
  })

  const node = unwrapEntity(payload)
  if (!node) {
    throw new Error('Unable to read admin profile.')
  }

  const user: AdminAuthUser = {
    id: String(read(node, 'id', '_id') ?? ''),
    email: String(read(node, 'email') ?? ''),
    role: String(read(node, 'role') ?? 'admin'),
  }

  return user
}

export async function logoutAdmin() {
  await request<Record<string, unknown>>('/api/admin/auth/logout', {
    method: 'POST',
  })
}

export async function getAdminProjects(token: string, status?: ItemStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  const payload = await request<unknown>(`/api/admin/projects${query}`, {
    headers: getAuthHeaders(token, false),
  })

  return unwrapList(payload).map(normalizeAdminProject)
}

export async function createAdminProject(token: string, payload: AdminProjectPayload, imageFile?: File | null) {
  const body = formDataFromProject(payload, imageFile)
  const result = await request<unknown>('/api/admin/projects', {
    method: 'POST',
    headers: getAuthHeaders(token, false),
    body,
  })

  const project = unwrapEntity(result)
  if (!project) {
    throw new Error('Unable to parse created project.')
  }

  return normalizeAdminProject(project)
}

export async function updateAdminProject(token: string, id: string, payload: AdminProjectPayload, imageFile?: File | null) {
  const body = formDataFromProject(payload, imageFile)
  const result = await request<unknown>(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token, false),
    body,
  })

  const project = unwrapEntity(result)
  if (!project) {
    throw new Error('Unable to parse updated project.')
  }

  return normalizeAdminProject(project)
}

export async function deleteAdminProject(token: string, id: string) {
  await request<Record<string, unknown>>(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token, false),
  })
}

export async function getAdminBlogs(token: string, status?: ItemStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  const payload = await request<unknown>(`/api/admin/blogs${query}`, {
    headers: getAuthHeaders(token, false),
  })

  return unwrapList(payload).map(normalizeAdminBlog)
}

export async function createAdminBlog(token: string, payload: AdminBlogPayload, imageFile?: File | null) {
  const body = formDataFromBlog(payload, imageFile)
  const result = await request<unknown>('/api/admin/blogs', {
    method: 'POST',
    headers: getAuthHeaders(token, false),
    body,
  })

  const blog = unwrapEntity(result)
  if (!blog) {
    throw new Error('Unable to parse created blog.')
  }

  return normalizeAdminBlog(blog)
}

export async function updateAdminBlog(token: string, id: string, payload: AdminBlogPayload, imageFile?: File | null) {
  const body = formDataFromBlog(payload, imageFile)
  const result = await request<unknown>(`/api/admin/blogs/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token, false),
    body,
  })

  const blog = unwrapEntity(result)
  if (!blog) {
    throw new Error('Unable to parse updated blog.')
  }

  return normalizeAdminBlog(blog)
}

export async function deleteAdminBlog(token: string, id: string) {
  await request<Record<string, unknown>>(`/api/admin/blogs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token, false),
  })
}

export async function getAdminMessages(token: string) {
  const candidatePaths = ['/api/admin/messages', '/api/admin/contacts', '/api/admin/contact-messages']

  for (const path of candidatePaths) {
    try {
      const payload = await request<unknown>(path, {
        headers: getAuthHeaders(token, false),
      })

      return unwrapList(payload).map(normalizeAdminMessage)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (!/status 404/i.test(message)) {
        throw error
      }
    }
  }

  return []
}

// PATCH /api/admin/messages/:id
export async function updateAdminMessage(
  token: string,
  id: string,
  payload: { status: 'read' | 'unread' | 'handled' | 'archived'; note?: string },
) {
  return request<Record<string, unknown>>(`/api/admin/messages/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

// DELETE /api/admin/messages/:id  (hard delete)
export async function deleteAdminMessage(token: string, id: string) {
  await request<Record<string, unknown>>(`/api/admin/messages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}