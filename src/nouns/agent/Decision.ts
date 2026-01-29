/**
 * Decision - A choice that may need approval
 *
 * A decision made by an agent that may require human oversight.
 */

import { $, Noun } from '../../core/nouns'

export const Decision = Noun({
  $type: 'Decision',
  $context: 'https://schema.org.ai',

  // Identity
  title: 'Decision title',
  description: 'What decision needs to be made',

  // Options
  options: 'Available options',
  recommendation: 'Recommended option',
  reasoning: 'Why this recommendation',

  // Status
  status: 'Pending | Approved | Rejected | Auto-Approved',
  approvedBy: $.Person,
  approvedAt: 'When approved',

  // Impact
  impactLevel: 'Low | Medium | High | Critical',
  requiresApproval: ($: any) => $.impactLevel === 'High' || $.impactLevel === 'Critical',

  // Relationships
  agent: $.Agent,
  task: $.Task,
  business: $.Business,
})
