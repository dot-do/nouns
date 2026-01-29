/**
 * Experiment - A test of a hypothesis
 *
 * An A/B test or multivariate experiment.
 */

import { $, Noun } from '../../core/nouns'

export const Experiment = Noun({
  $type: 'Experiment',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Experiment name',
  hypothesis: 'What we believe will happen',

  // Configuration
  variants: 'Variant configurations',
  trafficSplit: 'Traffic split percentages',
  metric: 'Primary metric to measure',
  minSampleSize: 'Minimum sample size for significance',

  // Status
  status: 'Draft | Running | Paused | Completed',
  startedAt: 'When experiment started',
  endedAt: 'When experiment ended',

  // Relationships
  business: $.Business,
  landingPages: $.LandingPage.where((l: any) => l.experiment),

  // Results
  winner: 'Winning variant',
  confidence: 'Statistical confidence',
  lift: 'Improvement percentage',

  // Generated
  analysis: 'Analyze results of {name} testing {hypothesis}',
  learnings: 'Key learnings from {name}',
  nextSteps: 'Recommended next steps after {name}',
})
