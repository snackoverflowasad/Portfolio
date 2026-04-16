export type ItemStatus = 'draft' | 'published' | 'archived'

export type PublicProject = {
  id: string
  slug: string
  title: string
  summary?: string
  description?: string
  imageUrl?: string
  projectUrl?: string
  liveUrl?: string
  repositoryUrl?: string
  techStack: string[]
}

export type PublicBlog = {
  id: string
  slug: string
  title: string
  summary?: string
  contentMarkdown?: string
  href?: string
  coverImageUrl?: string
  category?: string
  tags: string[]
}

export type PublicAchievement = {
  id: string
  title: string
  description?: string
  year?: number
  category?: string
}

export type ContactPayload = {
  senderName: string
  senderEmail: string
  inquiryType: string
  subject?: string
  organization?: string
  profileLink?: string
  message: string
}

export type AdminAuthUser = {
  id: string
  email: string
  role: string
}

export type AdminAuthLoginResponse = {
  accessToken: string
  user?: AdminAuthUser
}

export type AdminMessage = {
  id: string
  senderName: string
  senderEmail: string
  inquiryType: string
  subject: string
  message: string
  receivedAt: string
  status: 'unread' | 'read'
}

export type AdminProject = {
  id: string
  slug: string
  title: string
  summary?: string
  description?: string
  projectUrl?: string
  liveUrl?: string
  repositoryUrl?: string
  techStack: string[]
  imageUrl?: string
  status: ItemStatus
  featured?: boolean
}

export type AdminBlog = {
  id: string
  slug: string
  title: string
  summary?: string
  contentMarkdown?: string
  href?: string
  coverImageUrl?: string
  category?: string
  tags: string[]
  status: ItemStatus
  featured?: boolean
}

export type AdminProjectPayload = {
  title: string
  summary?: string
  description?: string
  projectUrl?: string
  liveUrl?: string
  repositoryUrl?: string
  techStack: string[]
  imageUrl?: string
  status: ItemStatus
  featured: boolean
}

export type AdminBlogPayload = {
  title: string
  summary?: string
  contentMarkdown?: string
  href?: string
  category?: string
  tags: string[]
  coverImageUrl?: string
  status: ItemStatus
  featured: boolean
}
