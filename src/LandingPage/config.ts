import type { GlobalConfig } from 'payload'

import { revalidateLandingPage } from './hooks/revalidateLandingPage'

export const LandingPage: GlobalConfig = {
  slug: 'landingPage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      defaultValue: 'Architecture in Motion',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      required: true,
      defaultValue:
        'From technical drawings to fully styled interiors, we design spaces as an evolving story.',
    },
    {
      name: 'heroCtaLabel',
      type: 'text',
      required: true,
      defaultValue: 'Get in Touch',
    },
    {
      name: 'heroCtaHref',
      type: 'text',
      required: true,
      defaultValue: '#contact',
    },
  ],
  hooks: {
    afterChange: [revalidateLandingPage],
  },
}

