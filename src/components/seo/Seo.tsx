import { Head } from 'vite-react-ssg'
import { env } from '@/lib/env'

export interface SeoProps {
  title: string
  description: string
  /** path only, e.g. "/terms". joined onto the site url for the canonical. */
  path?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  /** keep a page out of the index, e.g. app screens behind auth */
  noindex?: boolean
  publishedAt?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const SITE = 'updatebase'
const DEFAULT_IMAGE = '/og-image.png'

export function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  publishedAt,
  jsonLd,
}: SeoProps) {
  const url = new URL(path, env.VITE_SITE_URL).toString()
  const imageUrl = image.startsWith('http')
    ? image
    : new URL(image, env.VITE_SITE_URL).toString()

  // the wordmark is lowercase on purpose, so the title never gets title cased
  const fullTitle = path === '/' ? title : `${title} · ${SITE}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={description} />
      <meta property="og:locale" content="en_NG" />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Head>
  )
}
