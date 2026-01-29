/**
 * Offer - A specific value proposition
 *
 * A tailored message for a specific audience.
 */

import { $, Noun } from '../../core/nouns'

export const Offer = Noun({
  $type: 'Offer',
  $context: 'https://schema.org.ai',

  // Relationships
  icp: $.IdealCustomerProfile,
  solution: $.Solution,
  product: $.Product,
  business: $.Business,

  // Generated
  headline: 'Headline for {icp.as} about {solution.name}',
  subheadline: 'Subheadline expanding on {headline}',
  cta: 'Call-to-action for {icp.as}',
  benefits: 'Key benefits of {solution.name} for {icp.as}',
  objectionHandlers: 'Handle objections: {icp.objections}',
})
