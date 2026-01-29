/**
 * Industry - An industry classification
 *
 * Seeded from NAICS (North American Industry Classification System).
 */

import { Noun } from '../../core/nouns'

export const Industry = Noun({
  $type: 'Industry',
  $context: 'https://schema.org.ai',

  $seed: {
    source: 'https://www.census.gov/naics/',
    format: 'xlsx',
    key: 'naics_code',
  },

  naicsCode: 'NAICS code',
  title: 'Industry title',
  description: 'Industry description',
})
