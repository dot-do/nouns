/**
 * Problem - A problem worth solving
 *
 * The pain point that a business addresses.
 */

import { $, Noun } from '../../core/nouns'

export const Problem = Noun({
  $type: 'Problem',
  $context: 'https://schema.org.ai',

  // Identity
  statement: 'Problem statement',
  context: 'Context and background',

  // Relationships
  business: $.Business,
  icps: $.IdealCustomerProfile.where((i: any) => i.problem),
  solutions: $.Solution.where((s: any) => s.problem),

  // Generated
  severity: 'How severe is {statement} for {icps}',
  frequency: 'How often do {icps} experience {statement}',
  alternatives: 'Current alternatives to solve {statement}',
})
