export type OnboardingStep = 'profile' | 'conversation' | 'location' | 'app'

export type Gender = 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say'

export type Category =
  | 'jobs'
  | 'internships'
  | 'scholarships'
  | 'fellowships'
  | 'grants'
  | 'career'
  | 'events'
  | 'competitions'
  | 'hackathons'
  | 'bounties'
  | 'conferences'
  | 'volunteering'
  | 'alpha'

export type CareerStage =
  | 'student'
  | 'graduate'
  | 'postgraduate'
  | 'early-career'
  | 'mid-career'
  | 'senior'

export type Visibility = 'public' | 'followers' | 'organizations' | 'private'

export interface User {
  id: string
  email: string
  username?: string
  name?: string
  gender?: Gender
  dateOfBirth?: string
  avatarSeed?: string
  avatarStyle?: string
  photoUrl?: string
  avatarMode: 'avatar' | 'photo'
  bannerUrl?: string
  bio?: string
  interests?: Category[]
  careerStage?: CareerStage
  school?: string
  company?: string
  profession?: string
  yearsOfExperience?: number
  goals?: { shortTerm?: string; longTerm?: string }
  location?: { city?: string; country?: string; grantedAt?: string }
  onboarding?: {
    profileCompletedAt?: string | null
    conversationCompletedAt?: string | null
    locationPromptedAt?: string | null
  }
  onboardingComplete?: boolean
  profileVisibility: Visibility
  followerCount: number
  followingCount: number
  createdAt: string
}

export interface SessionPayload {
  accessToken: string
  user: User
  nextStep: OnboardingStep
}

export type OnboardingTopic =
  | 'interests'
  | 'specifics'
  | 'stage'
  | 'background'
  | 'accomplishments'
  | 'goals'
  | 'review'

export interface ConversationTurn {
  id: string
  role: 'user' | 'assistant'
  content: string
  topic?: OnboardingTopic
  critique?: string | null
  at: string
}

export interface ConversationState {
  turns: ConversationTurn[]
  extracted: Record<string, unknown>
  covered: OnboardingTopic[]
  currentTopic: OnboardingTopic
  draftBio?: string
  complete: boolean
  suggestions: string[]
  multiSelect: boolean
  critique?: string | null
}

export interface OrganizationCard {
  id: string
  _id?: string
  name: string
  handle: string
  logoUrl?: string
  verifiedAt?: string | null
  followerCount?: number
}

export interface UserCard {
  id: string
  _id?: string
  name?: string
  username?: string
  avatarSeed?: string
  avatarStyle?: string
  photoUrl?: string
  avatarMode?: 'avatar' | 'photo'
  bio?: string
  followerCount?: number
}

export interface Media {
  url: string
  kind: 'image' | 'video'
  width?: number
  height?: number
  blurhash?: string
  alt?: string
  /** a webvtt caption file, when the person who uploaded it provided one */
  captionsUrl?: string
}

export interface Update {
  id: string
  header: string
  body: string
  number: number
  footer?: string
  category: Category
  tags?: string[]
  link?: string
  media?: Media[]
  deadline?: string | null
  isRemote?: boolean
  eligibleCountries?: string[]
  publishedAt: string
  editedAt?: string | null
  organization: OrganizationCard
  author: UserCard | null
  counts: {
    love: number
    comment: number
    repost: number
    quote: number
    bookmark: number
    testimonial: number
    tipTotal: number
  }
  viewer: {
    loved: boolean
    bookmarked: boolean
    reposted: boolean
  }
}

export interface Paginated<T> {
  items: T[]
  nextCursor: string | null
}

export type NotificationKind =
  | 'new_update'
  | 'follow'
  | 'comment'
  | 'comment_reply'
  | 'mention'
  | 'reaction'
  | 'repost'
  | 'quote'
  | 'testimonial_quote'
  | 'testimonial_comment'
  | 'org_invite'
  | 'org_invite_accepted'
  | 'tip_received'
  | 'feedback_received'

export interface AppNotification {
  _id: string
  kind: NotificationKind
  actor?: UserCard | null
  actorOrganization?: OrganizationCard | null
  subjectType?: string
  subject?: string
  preview?: string
  link?: string
  readAt?: string | null
  createdAt: string
}

export interface Comment {
  _id: string
  body: string
  author: UserCard
  asOrganization?: OrganizationCard | null
  parent?: string | null
  depth: number
  loveCount: number
  replyCount: number
  createdAt: string
}

export type OrgRole = 'owner' | 'admin' | 'delegate'

export type Channel =
  | 'updatebase'
  | 'whatsapp-channel'
  | 'whatsapp-group'
  | 'x'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'telegram'

export type TipMode = 'poster' | 'split' | 'organization'

export interface Organization {
  _id: string
  id: string
  name: string
  handle: string
  logoUrl?: string
  bannerUrl?: string
  bio?: string
  tagline?: string
  communityLink?: string
  website?: string
  categories?: Category[]
  updateCounter: number
  connectedChannels: Channel[]
  tipMode: TipMode
  orgSharePercent: number
  followerCount: number
  updateCount: number
  memberCount: number
  verifiedAt?: string | null
  createdAt: string
  viewer?: {
    following: boolean
    role: OrgRole | null
    channels: Channel[]
  }
}

export interface MembershipSummary {
  organization: Organization
  role: OrgRole
  channels: Channel[]
}

export interface AiRuleSet {
  _id: string
  organization: string
  rules: string[]
  examples: { _id: string; input: string; output: string; note?: string }[]
  lowercase: boolean
  footer?: string
  signatureTemplate: string
  showNumber: boolean
  numberPrefix: string
  emojiVocabulary: string[]
  categoryHeaders?: Record<string, string>
  customPrompt?: string
}

export interface FormatResult {
  header: string
  body: string
  category: Category
  link: string | null
  tags: string[]
  deadline: string | null
  footer: string
  number: number
  assembled: string
  /** false when the deterministic formatter ran because ai was unavailable */
  usedAi: boolean
}

export interface RenderResult {
  renderings: Record<string, string>
  limits: Record<string, number>
}
