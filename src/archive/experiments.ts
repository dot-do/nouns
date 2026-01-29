import { DO } from './do/do'

export const Experiment = DO({
  $type: 'Experiment',
  $version: 1,

  // Identity
  name: 'Experiment name',
  hypothesis: 'What we believe to be true',
  description: 'Experiment description',

  // Design
  type: 'ABTest | MVT | FakeDoor | Concierge | WizardOfOz | Prototype',
  status: 'Draft | Running | Paused | Completed | Inconclusive',

  // Variants
  control: 'Control description',
  variants: [{
    name: 'Variant name',
    description: 'What is different',
    traffic: 'Traffic percentage (number)',
  }],

  // Metrics
  primaryMetric: 'Primary success metric',
  secondaryMetrics: ['Secondary metrics'],
  minimumEffect: 'Minimum detectable effect (number)',
  confidence: 'Required confidence level (number)',

  // Traffic
  trafficSplit: 'Traffic allocation (number)',
  sampleSize: 'Required sample size (number)',
  currentSample: 'Current sample (number)',

  // Timeline
  startDate: 'Start date (date)',
  endDate: 'Planned end date (date)',
  duration: 'Duration in days (number)',

  // Results
  results: {
    winner: 'Winning variant',
    uplift: 'Measured uplift (number)',
    confidence: 'Statistical confidence (number)',
    pValue: 'P-value (number)',
  },

  // Relationships
  product: 'Product being tested ->Product',
  feature: 'Feature being tested ->Feature',
  audience: 'Target audience ->IdealCustomerProfile',

  // Generated
  design: { mdx: 'Design experiment to test {hypothesis}' },
  analysis: { mdx: 'Analyze experiment results and recommend action' },

  // Events
  onExperimentCompleted: (exp, $) => $.call('analyzeResults', [exp]),
})

export const Hypothesis = DO({
  $type: 'Hypothesis',
  $version: 1,

  // Statement
  statement: 'We believe that...',
  because: 'Because...',

  // Structure (Lean)
  belief: 'What we believe',
  action: 'If we do this',
  outcome: 'We will achieve this',
  metric: 'Measured by this',
  threshold: 'Success threshold',

  // Status
  status: 'Untested | Testing | Validated | Invalidated | Pivoted',
  confidence: 'Confidence level 1-10 (number)',
  priority: 'Testing priority 1-10 (number)',

  // Evidence
  supporting: ['Supporting evidence'],
  contradicting: ['Contradicting evidence'],

  // Relationships
  startup: 'Related startup <-Startup',
  experiments: ['Validation experiments ->Experiment'],
  insights: ['Related insights ->Insight'],

  // Generated
  experiment: { mdx: 'Design experiment to test: {statement}' },
  pivot: { mdx: 'Suggest pivot if {statement} is invalidated' },
})
