/**
 * Market - A market opportunity
 *
 * Represents a target market defined by ICP and problem.
 */

import { $, Noun } from '../../core/nouns'

export const Market = Noun({
  $type: 'Market',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Market name',
  description: 'Market description',

  // Relationships
  icp: $.IdealCustomerProfile,
  problem: $.Problem,
  business: $.Business,

  // Generated market sizing
  tam: 'Total addressable market for {icp.sentence}',
  sam: 'Serviceable addressable market for {icp.sentence}',
  som: 'Serviceable obtainable market for {icp.sentence}',

  // Generated analysis
  trends: 'Market trends for {icp.industry}',
  competitors: 'Competitors solving {problem.statement}',
  gaps: 'Market gaps for {problem.statement}',
})
