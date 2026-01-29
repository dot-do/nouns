/**
 * Startup - An early-stage business designed for rapid growth
 *
 * Extends Business with funding, runway, and growth metrics.
 */

import { $ } from '../../core/nouns'
import { Business } from './Business'

export const Startup = Business({
  $type: 'Startup',

  vertical: 'Specific vertical within industry',
  stage: 'Pre-seed | Seed | Series A | Series B | Series C | Growth | Public',

  // Funding
  raised: 'Total funding raised',
  valuation: 'Current valuation',
  runway: 'Months of runway remaining',

  // Investors
  investors: $.Investor.where((i: any) => i.portfolio),
  leadInvestor: $.Investor,

  // Computed
  burnRate: ($: any) => $.raised && $.runway ? $.raised / $.runway : 0,
  monthsToDefault: ($: any) => $.stripeBalance && $.burnRate ? $.stripeBalance / $.burnRate : null,

  // Generated
  pitch: 'Elevator pitch for {name} in {vertical}',
  whyNow: 'Why now is the right time for {name}',
  competitiveAdvantage: 'Competitive advantage of {name}',
})
