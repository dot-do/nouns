/**
 * Google - Advertising and analytics
 *
 * Types for Google APIs (Ads, Analytics).
 */

import { $, Noun } from '../../core/nouns'
import { Source } from './Source'

export const Google = Source({
  $type: 'Google',
  baseUrl: 'https://googleads.googleapis.com',
  authMethod: 'OAuth',
  docsUrl: 'https://developers.google.com/google-ads/api/docs',
})

export const GoogleCampaign = Noun({
  $type: 'Google.Campaign',
  $context: 'https://schema.org.ai',

  id: 'Campaign ID',
  name: 'Campaign name',
  status: 'ENABLED | PAUSED | REMOVED',
  budget: 'Daily budget',
  startDate: 'Start date',
  endDate: 'End date',

  // Metrics
  impressions: 'Total impressions',
  clicks: 'Total clicks',
  conversions: 'Total conversions',
  cost: 'Total cost',
  ctr: 'Click-through rate',
  cpc: 'Cost per click',
})
