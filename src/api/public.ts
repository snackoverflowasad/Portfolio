import type { ContactPayload, PublicAchievement, PublicBlog, PublicProject } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || ''
// const LOCAL_BACKEND_ORIGIN = import.meta.env.BASE_URL

export type { ContactPayload, PublicAchievement, PublicBlog, PublicProject }

function buildUrl(path: string) {
  // if (!API_BASE_URL) {
  //   return `${LOCAL_BACKEND_ORIGIN}${path}`
  // }

  return `${API_BASE_URL}${path}`
}

function toObject(value: unknown) {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>
  }

  return null
}

function normalizeLookupKey(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

function readValueByKeys(node: Record<string, unknown> | null, keys: string[]) {
  if (!node) {
    return undefined
  }

  const normalizedEntries = Object.entries(node).map(([key, value]) => [normalizeLookupKey(key), value] as const)

  for (const key of keys) {
    const normalizedKey = normalizeLookupKey(key)

    const exactMatch = node[key]
    if (exactMatch !== undefined) {
      return exactMatch
    }

    const looseMatch = normalizedEntries.find(([entryKey]) => entryKey === normalizedKey)?.[1]
    if (looseMatch !== undefined) {
      return looseMatch
    }
  }

  return undefined
}

function unwrapEntityPayload(payload: unknown) {
  const root = toObject(payload)
  if (!root) {
    return null
  }

  const dataNode = toObject(root.data)
  const directCandidates = [root.item, root.project, root.blog, root.achievement, dataNode?.item, dataNode?.project, dataNode?.blog, dataNode?.achievement]

  for (const candidate of directCandidates) {
    const entity = toObject(candidate)
    if (entity) {
      return entity
    }
  }

  if (dataNode) {
    return dataNode
  }

  return root
}

function toArrayOfObjects(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => toObject(item))
    .filter((item): item is Record<string, unknown> => item !== null)
}

function unwrapListPayload(payload: unknown) {
  if (Array.isArray(payload)) {
    return toArrayOfObjects(payload)
  }

  const root = toObject(payload)
  if (!root) {
    return []
  }

  const dataNode = toObject(root.data)
  const candidates = [root.items, root.results, root.projects, root.blogs, root.achievements, dataNode?.items, dataNode?.results, dataNode?.projects, dataNode?.blogs, dataNode?.achievements]

  for (const candidate of candidates) {
    const list = toArrayOfObjects(candidate)
    if (list.length > 0) {
      return list
    }
  }

  return toArrayOfObjects(root.data)
}

function normalizeStringList(value: unknown) {
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

function toSafeExternalUrl(value: unknown) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }

  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined
    }

    return parsed.toString()
  } catch {
    return undefined
  }
}

function isPubliclyVisible(node: Record<string, unknown>) {
  const status = readValueByKeys(node, ['status', 'state'])
  const publishedFlag = readValueByKeys(node, ['published', 'isPublished'])

  if (typeof status === 'string') {
    const normalized = status.trim().toLowerCase()
    return normalized === 'published' || normalized === 'active'
  }

  if (typeof publishedFlag === 'boolean') {
    return publishedFlag
  }

  // If backend doesn't expose status metadata, preserve backward compatibility.
  return true
}

function normalizePublicProject(project: Record<string, unknown>): PublicProject {
  const summary = readValueByKeys(project, ['summary', 'readme', 'excerpt', 'description'])
  const description = readValueByKeys(project, ['description', 'readme', 'summary', 'excerpt'])
  const projectUrl = readValueByKeys(project, ['projectUrl', 'project_url', 'projecturl', 'liveUrl', 'live_url', 'externalUrl', 'external_url', 'href', 'repositoryUrl', 'repository_url'])
  const liveUrl = readValueByKeys(project, ['liveUrl', 'live_url'])
  const repositoryUrl = readValueByKeys(project, ['repositoryUrl', 'repository_url'])
  const techStack = readValueByKeys(project, ['techStack', 'tech_stack', 'keywords', 'tags'])

  return {
    id: String(readValueByKeys(project, ['id', '_id', 'slug']) ?? ''),
    slug: String(readValueByKeys(project, ['slug']) ?? ''),
    title: String(readValueByKeys(project, ['title']) ?? ''),
    summary: summary ? String(summary) : undefined,
    description: description ? String(description) : undefined,
    projectUrl: toSafeExternalUrl(projectUrl),
    liveUrl: toSafeExternalUrl(liveUrl),
    repositoryUrl: toSafeExternalUrl(repositoryUrl),
    techStack: normalizeStringList(techStack),
    imageUrl: readValueByKeys(project, ['imageUrl', 'image_url']) ? String(readValueByKeys(project, ['imageUrl', 'image_url'])) : undefined,
  }
}

function normalizePublicBlog(blog: Record<string, unknown>): PublicBlog {
  const summary = readValueByKeys(blog, ['summary', 'excerpt', 'description'])
  const contentMarkdown = readValueByKeys(blog, ['contentMarkdown', 'content_markdown', 'content'])
  const href = readValueByKeys(blog, ['href', 'externalUrl', 'external_url', 'url'])
  const tags = readValueByKeys(blog, ['tags', 'tag_list'])

  return {
    id: String(readValueByKeys(blog, ['id', '_id', 'slug']) ?? ''),
    slug: String(readValueByKeys(blog, ['slug']) ?? ''),
    title: String(readValueByKeys(blog, ['title']) ?? ''),
    summary: summary ? String(summary) : undefined,
    contentMarkdown: contentMarkdown ? String(contentMarkdown) : undefined,
    href: toSafeExternalUrl(href),
    coverImageUrl: readValueByKeys(blog, ['coverImageUrl', 'cover_image_url']) ? String(readValueByKeys(blog, ['coverImageUrl', 'cover_image_url'])) : undefined,
    category: readValueByKeys(blog, ['category']) ? String(readValueByKeys(blog, ['category'])) : undefined,
    tags: normalizeStringList(tags),
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), options)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export async function getHealth() {
  return request<Record<string, unknown>>('/health')
}

export async function getHomeData() {
  return request<Record<string, unknown>>('/api/site/home')
}

export async function getPublicProjects() {
  const payload = await request<unknown>('/api/projects')
  return unwrapListPayload(payload)
    .filter(isPubliclyVisible)
    .map(normalizePublicProject)
}

export async function getPublicProjectBySlug(slug: string) {
  const payload = await request<unknown>(`/api/projects/${encodeURIComponent(slug)}`)
  const project = unwrapEntityPayload(payload)

  if (!project) {
    throw new Error('Project not found.')
  }

  return normalizePublicProject(project)
}

export async function getPublicBlogs() {
  const payload = await request<unknown>('/api/blogs')
  return unwrapListPayload(payload)
    .filter(isPubliclyVisible)
    .map(normalizePublicBlog)
}

export async function getPublicBlogBySlug(slug: string) {
  const payload = await request<unknown>(`/api/blogs/${encodeURIComponent(slug)}`)
  const blog = unwrapEntityPayload(payload)

  if (!blog) {
    throw new Error('Blog not found.')
  }

  return normalizePublicBlog(blog)
}

export async function getPublicAchievements() {
  const payload = await request<unknown>('/api/achievements')

  if (Array.isArray(payload)) {
    return payload.map((item) => {
      const achievement = toObject(item)

      return {
        id: String(readValueByKeys(achievement, ['id', '_id', 'slug']) ?? ''),
        title: String(readValueByKeys(achievement, ['title']) ?? ''),
        description: readValueByKeys(achievement, ['description'])
          ? String(readValueByKeys(achievement, ['description']))
          : undefined,
        year: typeof readValueByKeys(achievement, ['year']) === 'number'
          ? Number(readValueByKeys(achievement, ['year']))
          : undefined,
        category: readValueByKeys(achievement, ['category'])
          ? String(readValueByKeys(achievement, ['category']))
          : undefined,
      } as PublicAchievement
    })
  }

  const list = unwrapListPayload(payload)

  return list.map((achievement) => ({
    id: String(readValueByKeys(achievement, ['id', '_id', 'slug']) ?? ''),
    title: String(readValueByKeys(achievement, ['title']) ?? ''),
    description: readValueByKeys(achievement, ['description'])
      ? String(readValueByKeys(achievement, ['description']))
      : undefined,
    year: typeof readValueByKeys(achievement, ['year']) === 'number'
      ? Number(readValueByKeys(achievement, ['year']))
      : undefined,
    category: readValueByKeys(achievement, ['category'])
      ? String(readValueByKeys(achievement, ['category']))
      : undefined,
  }))
}

export async function submitContactForm(payload: ContactPayload) {
  return request<Record<string, unknown>>('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
