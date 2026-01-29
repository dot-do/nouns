/**
 * Campaign - A marketing campaign
 *
 * A coordinated marketing effort with specific goals.
 */

import { $, Noun } from '../../core/nouns'

export const Campaign = Noun({
  $type: 'Campaign',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Campaign name',
  description: 'Campaign description',

  // Configuration
  channel: 'Paid | Organic | Email | Social | Content | Referral',
  status: 'Draft | Active | Paused | Completed',
  budget: 'Campaign budget',

  // Timing
  startDate: 'Campaign start date',
  endDate: 'Campaign end date',

  // Targeting
  icp: $.IdealCustomerProfile,
  offer: $.Offer,

  // Relationships
  landingPages: $.LandingPage.where((l: any) => l.campaign),
  business: $.Business,

  // External
  googleCampaign: $.Google.Campaign,

  // Metrics
  impressions: 'Total impressions',
  clicks: 'Total clicks',
  conversions: 'Total conversions',
  spend: 'Total spend',

  // Computed
  ctr: ($: any) => $.impressions > 0 ? $.clicks / $.impressions : 0,
  cpc: ($: any) => $.clicks > 0 ? $.spend / $.clicks : 0,
  cpa: ($: any) => $.conversions > 0 ? $.spend / $.conversions : 0,
  roas: ($: any) => $.spend > 0 ? $.revenue / $.spend : 0,
})
