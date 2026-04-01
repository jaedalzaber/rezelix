import type { Metadata } from 'next'

import { LandingExperience } from '@/components/landing/LandingExperience'
import type { LandingPage } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

const defaultLandingContent = {
  heroCtaHref: '#contact',
  heroCtaLabel: 'Get in Touch',
  heroSubtitle:
    'From technical drawings to fully styled interiors, we design spaces as an evolving story.',
  heroTitle: 'Architecture in Motion',
}

const getLandingPage = async () => {
  let landing: LandingPage | null = null

  try {
    landing = (await getCachedGlobal('landingPage', 0)()) as LandingPage
  } catch {
    return defaultLandingContent
  }

  return {
    heroCtaHref: landing?.heroCtaHref || defaultLandingContent.heroCtaHref,
    heroCtaLabel: landing?.heroCtaLabel || defaultLandingContent.heroCtaLabel,
    heroSubtitle: landing?.heroSubtitle || defaultLandingContent.heroSubtitle,
    heroTitle: landing?.heroTitle || defaultLandingContent.heroTitle,
  }
}

export default async function HomePage() {
  const landing = await getLandingPage()

  return (
    <article>
      <LandingExperience {...landing} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const landing = await getLandingPage()

  return {
    description: landing.heroSubtitle,
    title: `${landing.heroTitle} | Rezeliz`,
  }
}
