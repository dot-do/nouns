import { DO } from './do/do'

export const LandingPage = DO({
  $type: 'LandingPage',
  $version: 1,

  // Identity
  name: 'Page name',
  slug: 'URL path',
  purpose: 'Awareness | Consideration | Conversion | Retention',

  // Hero section
  hero: {
    headline: 'Primary headline',
    subheadline: 'Supporting text',
    cta: 'Call to action text',
    image: 'Hero image URL',
  },

  // Sections
  sections: [{
    type: 'Features | Benefits | Social Proof | Pricing | FAQ | CTA',
    headline: 'Section headline',
    content: 'Section content',
  }],

  // Conversion
  form: {
    fields: ['Form field names'],
    cta: 'Submit button text',
    destination: 'Where to send leads',
  },

  // SEO
  seo: {
    title: 'Page title',
    description: 'Meta description',
    keywords: ['Target keywords'],
  },

  // Relationships
  product: 'Related product ->Product',
  campaign: 'Related campaign ->Campaign',
  variants: ['A/B test variants ->LandingPage'],

  // Metrics
  metrics: {
    visitors: 'Total visitors (number)',
    conversions: 'Total conversions (number)',
    conversionRate: 'Conversion rate (number)',
  },

  // Generated
  copy: { mdx: 'Generate landing page copy for {product} targeting {audience}' },
  headlineVariants: { mdx: 'Generate 3 headline variants for {hero.headline}' },
})

export const Campaign = DO({
  $type: 'Campaign',
  $version: 1,

  // Identity
  name: 'Campaign name',
  objective: 'Awareness | Consideration | Conversion | Retention',

  // Timing
  startDate: 'Campaign start (date)',
  endDate: 'Campaign end (date)',
  status: 'Draft | Scheduled | Active | Paused | Completed',

  // Budget
  budget: 'Total budget (number)',
  spent: 'Amount spent (number)',
  currency: 'USD | EUR | GBP',

  // Channels
  channels: ['Marketing channels'],

  // Content
  creatives: [{
    type: 'Ad | Email | Social | Landing',
    name: 'Creative name',
    url: 'Creative URL',
  }],

  // Targeting
  audience: 'Target audience ->IdealCustomerProfile',
  targeting: {
    demographics: 'Demographic targeting',
    interests: ['Interest targeting'],
    behaviors: ['Behavior targeting'],
  },

  // Metrics
  metrics: {
    impressions: 'Total impressions (number)',
    clicks: 'Total clicks (number)',
    conversions: 'Total conversions (number)',
    ctr: 'Click-through rate (number)',
    cpc: 'Cost per click (number)',
    cpa: 'Cost per acquisition (number)',
    roas: 'Return on ad spend (number)',
  },

  // Relationships
  product: 'Promoted product ->Product',
  landingPages: ['Landing pages ->LandingPage'],

  // Generated
  brief: { mdx: 'Generate campaign brief for {objective} targeting {audience}' },
  report: { mdx: 'Generate campaign performance report' },

  // Schedules
  everyDay: ($) => $.call('syncMetrics', []),
})
