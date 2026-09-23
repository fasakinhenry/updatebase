import { env } from '@/lib/env'

const site = () => env.VITE_SITE_URL

/** the brand entity google uses for the knowledge panel and the logo in results. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site()}/#organization`,
    name: 'updatebase',
    url: site(),
    logo: {
      '@type': 'ImageObject',
      url: `${site()}/icons/icon-512.png`,
      width: 512,
      height: 512,
    },
    description:
      'updatebase turns opportunities into branded, numbered updates for communities, and gives their members a feed worth following.',
    foundingLocation: {
      '@type': 'Place',
      name: 'Akure, Ondo State, Nigeria',
    },
    sameAs: [
      'https://x.com/updatebase',
      'https://www.linkedin.com/company/updatebase',
      'https://www.instagram.com/updatebase',
    ],
  }
}

/** the sitelinks search box, so a brand search can search the product directly. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site()}/#website`,
    name: 'updatebase',
    url: site(),
    publisher: { '@id': `${site()}/#organization` },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site()}/discover?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'updatebase',
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'Web, Android, iOS',
    url: site(),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NGN',
      description: 'free to create an organization and post updates',
    },
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** breadcrumbs are what earn the sitelink rows under the main result. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${site()}${crumb.path}`,
    })),
  }
}
