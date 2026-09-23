import type { Category } from '@/types/api'

/** the header each category gets by default, mirroring the api. */
export const CATEGORY_HEADERS: Record<Category, string> = {
  jobs: '💼 job update',
  internships: '🧑‍💻 internship update',
  scholarships: '🎓 scholarship update',
  fellowships: '🌍 fellowship update',
  grants: '💰 grant update',
  career: '📈 career update',
  events: '📅 event update',
  competitions: '🏆 competition update',
  hackathons: '🚀 hackathon update',
  bounties: '🎯 bounty update',
  conferences: '🎤 conference update',
  volunteering: '🤝 volunteering update',
  alpha: '🔓 alpha',
}

/** what a filter chip says, and what onboarding offers as pills. */
export const CATEGORY_LABELS: Record<Category, string> = {
  jobs: 'jobs',
  internships: 'internships',
  scholarships: 'scholarships',
  fellowships: 'fellowships',
  grants: 'grants',
  career: 'career',
  events: 'events',
  competitions: 'competitions',
  hackathons: 'hackathons',
  bounties: 'bounties',
  conferences: 'conferences',
  volunteering: 'volunteering',
  alpha: 'alpha',
}

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
