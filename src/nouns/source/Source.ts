/**
 * Source - An external data source
 *
 * Base type for external API integrations.
 */

import { Noun } from '../../core/nouns'

export const Source = Noun({
  $type: 'Source',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Source name',
  description: 'Source description',

  // API Configuration
  baseUrl: 'API base URL',
  authMethod: 'API Key | OAuth | Bearer | Basic',
  docsUrl: 'API documentation URL',

  // Rate limits
  rateLimit: 'Requests per minute',
  rateLimitWindow: 'Rate limit window',
})
