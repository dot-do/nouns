/**
 * Lead - A potential customer
 *
 * Someone who has shown interest but hasn't converted yet.
 */

import { $ } from '../../core/nouns'
import { Person } from '../base/Person'

export const Lead = Person({
  $type: 'Lead',

  // Source tracking
  source: 'Organic | Paid | Referral | Outbound',
  campaign: 'Campaign that generated this lead',
  landingPage: 'Landing page URL',

  // Qualification
  status: 'New | Contacted | Qualified | Converted | Lost',
  score: 'Lead score (0-100)',

  // Business relationship
  business: $.Business,

  // Generated
  qualificationNotes: 'Qualification notes for {name} from {company}',
  nextAction: 'Recommended next action for {name}',
})
