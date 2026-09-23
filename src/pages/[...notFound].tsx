import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Seo } from '@/components/seo/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="page not found"
        description="that page does not exist on updatebase."
        path="/404"
        noindex
      />

      <Navbar />

      <main id="main">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-section-sm text-center">
          <p className="text-overline uppercase text-primary">404</p>

          <h1 className="text-display-xl measure-tight text-ink">
            this one got away
          </h1>

          <p className="measure text-lead text-ink-soft">
            the page you are looking for moved, or it never existed. the updates are still where
            you left them.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button to="/" size="lg" icon={null}>
              back home
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  )
}
