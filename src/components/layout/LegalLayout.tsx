import type { ReactNode } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Container } from '@/components/ui/Container'
import { SmartLink } from '@/components/ui/SmartLink'

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <>
      <Navbar />

      <main id="main">
        <Container className="py-section-sm">
          <SmartLink
            to="/"
            className="inline-flex items-center gap-2 text-label text-ink-muted transition-colors duration-fast hover:text-primary"
          >
            <ArrowLeft size={15} weight="bold" aria-hidden="true" />
            back home
          </SmartLink>

          <h1 className="mt-8 text-display-xl text-ink">{title}</h1>
          <p className="mt-3 text-body-sm text-ink-muted">last updated {updated}</p>

          <div className="measure-wide mt-10 flex flex-col gap-8">{children}</div>
        </Container>
      </main>

      <Footer />
    </>
  )
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-display-sm text-ink">{heading}</h2>
      <div className="flex flex-col gap-3 text-body-lg text-ink-soft [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
        {children}
      </div>
    </section>
  )
}
