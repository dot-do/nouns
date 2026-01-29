/**
 * LandingPage - A page designed to convert visitors
 *
 * A focused page with a single conversion goal.
 */

import { $, Noun } from '../../core/nouns'

export const LandingPage = Noun({
  $type: 'LandingPage',
  $context: 'https://schema.org.ai',

  // Identity
  slug: 'URL path',
  title: 'Page title',

  // Relationships
  offer: $.Offer,
  experiment: $.Experiment,
  business: $.Business,

  // Generated content
  heroHeadline: 'Hero headline for {offer.headline}',
  heroSubheadline: 'Hero subheadline for {offer.subheadline}',
  heroCta: 'Hero CTA: {offer.cta}',
  problemSection: 'Problem section for {offer.icp.painPoints}',
  solutionSection: 'Solution section for {offer.solution}',
  benefitsSection: 'Benefits section for {offer.benefits}',
  socialProof: 'Social proof for {offer.icp}',

  // Deployment
  deployment: $.Vercel.Deployment,
  url: $.deployment.url,
  deployedAt: $.deployment.createdAt,

  // Analytics
  analytics: $.Analytics.Page,
  visitors: $.analytics.visitors,
  conversions: $.analytics.conversions,
  conversionRate: ($: any) => $.visitors > 0 ? $.conversions / $.visitors : 0,
})
