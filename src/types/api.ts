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
