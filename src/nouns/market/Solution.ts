/**
 * Solution - How we solve a problem
 *
 * The approach a business takes to address a problem.
 */

import { $, Noun } from '../../core/nouns'

export const Solution = Noun({
  $type: 'Solution',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Solution name',
  description: 'How we solve the problem',

  // Relationships
  problem: $.Problem,
  product: $.Product,
  business: $.Business,

  // Generated
  uniqueValue: 'Unique value proposition for {name}',
  differentiation: 'How {name} differs from alternatives',
})
