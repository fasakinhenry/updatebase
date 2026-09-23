import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { ProofStrip } from '@/components/landing/ProofStrip'
import { BeforeAfter } from '@/components/landing/BeforeAfter'
import { ChannelShowcase } from '@/components/landing/ChannelShowcase'
import { ForOrganizations } from '@/components/landing/ForOrganizations'
import { ForMembers } from '@/components/landing/ForMembers'
import { Testimonials } from '@/components/landing/Testimonials'
import { TipsAndSplits } from '@/components/landing/TipsAndSplits'
import { Roles } from '@/components/landing/Roles'
import { Faq, faqItems } from '@/components/landing/Faq'
import { WaitlistCta } from '@/components/landing/WaitlistCta'
import { Seo } from '@/components/seo/Seo'
import {
  faqSchema,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from '@/components/seo/structuredData'

export default function LandingPage() {
  return (
    <>
      <Seo
        title="updatebase, every opportunity your community shares"
        description="paste a scholarship, job or hackathon and get it back branded, numbered and ready for whatsapp in seconds. built for community conveners and the people who follow them."
        path="/"
        jsonLd={[
          organizationSchema(),
          websiteSchema(),
          softwareApplicationSchema(),
          faqSchema(faqItems),
        ]}
      />

      <Navbar />

      <main id="main">
        <Hero />
        <ProofStrip />
        <BeforeAfter />
        <ChannelShowcase />
        <ForOrganizations />
        <ForMembers />
        <Testimonials />
        <TipsAndSplits />
        <Roles />
        <Faq />
        <WaitlistCta />
      </main>

      <Footer />
    </>
  )
}
