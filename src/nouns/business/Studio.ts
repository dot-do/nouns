/**
 * Studio - A venture studio or startup factory
 *
 * A business that builds and launches multiple startups.
 */

import { $ } from '../../core/nouns'
import { Business } from './Business'

export const Studio = Business({
  $type: 'Studio',

  focus: 'Studio focus area',
  model: 'Venture Studio | Agency | Incubator | Accelerator',

  // Portfolio
  portfolio: $.Startup.where((s: any) => s.studio),
  portfolioCount: $.count($.portfolio),

  // Success metrics
  exits: $.Exit.where((e: any) => e.studio),
  totalExitValue: $.sum($.exits.value),

  // Generated
  thesis: 'Investment thesis for {name}',
})
