/**
 * Occupation - An occupation classification
 *
 * Seeded from O*NET (Occupational Information Network).
 */

import { Noun } from '../../core/nouns'

export const Occupation = Noun({
  $type: 'Occupation',
  $context: 'https://schema.org.ai',

  $seed: {
    source: 'https://www.onetcenter.org/taxonomy/occupations.tsv',
    format: 'tsv',
    key: 'onet_soc_code',
  },

  onetCode: 'O*NET SOC code',
  title: 'Occupation title',
  description: 'Occupation description',
})
