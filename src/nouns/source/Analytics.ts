/**
 * Analytics - Web analytics
 *
 * Types for analytics data.
 */

import { Noun } from '../../core/nouns'
import { Source } from './Source'

export const Analytics = Source({
  $type: 'Analytics',
  baseUrl: 'https://analyticsdata.googleapis.com',
  authMethod: 'OAuth',
  docsUrl: 'https://developers.google.com/analytics/devguides/reporting',
})

export const AnalyticsPage = Noun({
  $type: 'Analytics.Page',
  $context: 'https://schema.org.ai',

  path: 'Page path',
  title: 'Page title',

  // Metrics
  visitors: 'Unique visitors',
  pageviews: 'Total pageviews',
  avgTimeOnPage: 'Average time on page',
  bounceRate: 'Bounce rate',
  conversions: 'Conversions',
  conversionRate: 'Conversion rate',
})
