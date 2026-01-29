/**
 * IdealCustomerProfile - AI-generated customer archetype
 *
 * Represents the ideal target customer with grounded attributes.
 */

import { $, Noun } from '../../core/nouns'

export const IdealCustomerProfile = Noun({
  $type: 'IdealCustomerProfile',
  $context: 'https://schema.org.ai',

  // Grounding (fuzzy match to reference data)
  occupation: $.fuzzy($.Occupation),
  industry: $.fuzzy($.Industry),

  // Generated persona
  as: 'Role/title grounded to {occupation}',
  at: 'Company type grounded to {industry}',
  doing: 'What activity are they doing?',
  using: 'What tools are they using?',
  toAchieve: 'What goal are they trying to achieve?',

  // Deep generation
  painPoints: 'Top 5 pain points for {as} at {at}',
  motivations: 'Key motivations for {as}',
  objections: 'Common objections from {as}',
  triggers: 'Buying triggers for {as}',

  // Computed
  sentence: ($: any) => `${$.as} at ${$.at} are ${$.doing} using ${$.using} to ${$.toAchieve}`,

  // Relationships
  problem: $.Problem,
  business: $.Business,
})
