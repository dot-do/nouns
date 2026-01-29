import { DO } from './do/do'

export const Goal = DO({
  $type: 'Goal',
  $version: 1,

  // Identity
  name: 'Goal name',
  description: 'Goal description',

  // Classification
  category: 'Strategic | Operational | Financial | Customer | Product | Team',
  priority: 'Critical | High | Medium | Low',
  type: 'Outcome | Output | Activity',

  // Progress
  status: 'NotStarted | InProgress | AtRisk | OnTrack | Completed | Cancelled',
  progress: 'Completion percentage 0-100 (number)',
  target: 'Target value or outcome',
  current: 'Current value or state',

  // Timeline
  startDate: 'Start date (date)',
  targetDate: 'Target completion date (date)',
  completedDate: 'Actual completion date (date)',

  // Ownership
  owner: 'Goal owner ->Person',
  team: 'Responsible team ->Team',
  stakeholders: ['Interested parties ->Person'],

  // Success
  successCriteria: ['How success is measured'],
  metrics: ['Key metrics ->KPI'],

  // Hierarchy
  parent: 'Parent goal ->Goal',
  subgoals: ['Child goals <-Goal.parent'],
  dependencies: ['Blocking goals ->Goal'],
  blockedBy: ['Goals this is blocked by ->Goal'],

  // Alignment
  okr: 'Related OKR ->OKR',
  initiative: 'Related initiative ->Initiative',

  // Generated
  statusReport: { mdx: 'Generate status report for {name} at {progress}%' },

  // Events
  onGoalCompleted: (goal, $) => $.emit('goal.completed', { id: goal.$id }),
  onGoalAtRisk: (goal, $) => $.call('alertStakeholders', [goal]),
})

export const KPI = DO({
  $type: 'KPI',
  $version: 1,

  // Identity
  name: 'KPI name',
  description: 'What this KPI measures',

  // Classification
  category: 'Revenue | Growth | Engagement | Efficiency | Quality | Customer',
  frequency: 'Realtime | Daily | Weekly | Monthly | Quarterly | Annual',

  // Measurement
  metric: 'What is measured',
  unit: 'Unit of measurement',
  format: 'Number | Percentage | Currency | Duration',

  // Targets
  target: 'Target value (number)',
  current: 'Current value (number)',
  baseline: 'Baseline value (number)',
  stretch: 'Stretch target (number)',

  // Thresholds
  thresholds: {
    critical: 'Critical threshold (number)',
    warning: 'Warning threshold (number)',
    good: 'Good threshold (number)',
    excellent: 'Excellent threshold (number)',
  },

  // Status
  status: 'Critical | Warning | OnTrack | Exceeding',
  trend: 'Improving | Stable | Declining',

  // History
  history: [{
    date: 'Measurement date (date)',
    value: 'Measured value (number)',
    note: 'Optional note',
  }],

  // Ownership
  owner: 'KPI owner ->Person',
  dataSource: 'Where data comes from',

  // Relationships
  goals: ['Related goals <-Goal.metrics'],
  dashboards: ['Displayed on <-Dashboard.kpis'],

  // Schedules
  everyDay: ($) => $.call('updateFromSource', []),
})

export const OKR = DO({
  $type: 'OKR',
  $version: 1,

  // Identity
  objective: 'Objective statement',
  description: 'Context and rationale',

  // Period
  period: 'Q1 | Q2 | Q3 | Q4 | H1 | H2 | Annual',
  year: 'Year (number)',
  startDate: 'Period start (date)',
  endDate: 'Period end (date)',

  // Ownership
  owner: 'OKR owner ->Person',
  team: 'Owning team ->Team',

  // Key Results
  keyResults: [{
    description: 'Key result description',
    metric: 'How it is measured',
    baseline: 'Starting value (number)',
    target: 'Target value (number)',
    current: 'Current value (number)',
    confidence: 'Confidence level 0-1 (number)',
    status: 'NotStarted | InProgress | AtRisk | Achieved',
  }],

  // Status
  status: 'Draft | Active | Completed | Cancelled',
  score: 'Overall score 0-1 (number)',
  grade: 'A | B | C | D | F',

  // Alignment
  parent: 'Company/team OKR this supports ->OKR',
  children: ['OKRs that support this <-OKR.parent'],
  goals: ['Supporting goals ->Goal'],

  // Generated
  review: { mdx: 'Generate OKR review for {objective} with score {score}' },

  // Events
  onOKRScored: (okr, $) => $.emit('okr.scored', { id: okr.$id, score: okr.score }),
})
