import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from '@/components/ui/Toaster'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { hydrateTheme } from '@/stores/theme'
import { useLenis } from '@/hooks/useLenis'

export default function RootLayout() {
  useLenis()

  useEffect(() => {
    hydrateTheme()
  }, [])

  return (
    <QueryProvider>
      {/* the first thing a keyboard or screen reader user meets on every page */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-label focus:text-on-primary"
      >
        skip to content
      </a>

      <Outlet />

      <Toaster />
      <CookieConsent />
      <ScrollRestoration />
    </QueryProvider>
  )
}
