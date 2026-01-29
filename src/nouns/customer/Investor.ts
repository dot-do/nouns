/**
 * Investor - Someone who provides capital
 *
 * A person or entity that invests in startups/businesses.
 */

import { $ } from '../../core/nouns'
import { Person } from '../base/Person'

export const Investor = Person({
  $type: 'Investor',

  firm: 'Investment firm',
  investorKind: 'Angel | VC | PE | Corporate | Family Office',
  checkSize: 'Typical check size range',
  stage: 'Stages invested in',
  sectors: 'Sectors of interest',

  // Portfolio
  portfolio: $.Startup.where((s: any) => s.investors),
  portfolioCount: $.count($.portfolio),

  // Metrics
  totalInvested: $.sum($.portfolio.investedAmount),
  exits: $.count($.portfolio.exits),

  // Generated
  investmentThesis: 'Investment thesis for {name} at {firm}',
})
