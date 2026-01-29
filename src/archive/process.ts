import { DO } from './do/do'

export const Process = DO({
  $type: 'Process',
  $version: 1,

  // Identity
  name: 'Process name',
  description: 'What this process accomplishes',
  category: 'Core | Support | Management',

  // Classification (APQC)
  apqcId: 'APQC Process Classification ID',
  level: 'Category | ProcessGroup | Process | Activity | Task',

  // Definition
  trigger: 'What initiates this process',
  inputs: ['Required inputs'],
  outputs: ['Produced outputs'],
  deliverables: ['Final deliverables'],

  // Steps
  steps: [{
    order: 'Step sequence (number)',
    name: 'Step name',
    description: 'What happens',
    responsible: 'Who does this ->Role',
    duration: 'Expected duration',
    automationLevel: 'Manual | Assisted | Automated',
  }],

  // Ownership
  owner: 'Process owner ->Person',
  department: 'Owning department',
  stakeholders: ['Process stakeholders ->Person'],

  // Systems
  systemsOfRecord: ['Systems used'],
  tools: ['Tools required ->Tool'],
  data: ['Data accessed'],

  // Metrics
  metrics: {
    avgDuration: 'Average duration (number)',
    throughput: 'Items per period (number)',
    errorRate: 'Error rate (number)',
    automationPercent: 'Automation percentage (number)',
  },

  // Dependencies
  upstream: ['Upstream processes ->Process'],
  downstream: ['Downstream processes ->Process'],
  alternatives: ['Alternative processes ->Process'],

  // Documentation
  diagram: 'Process diagram URL',
  swimlane: 'Swimlane diagram URL',
  sop: 'Standard operating procedure URL',

  // Generated
  documentation: { mdx: 'Generate process documentation for {name}' },
  optimization: { mdx: 'Identify optimization opportunities for {name}' },
})

export const Event = DO({
  $type: 'Event',
  $version: 1,

  // Identity (5W+H)
  what: 'What happened',
  who: 'Who was involved ->Person | Agent',
  when: 'When it happened (date)',
  where: 'Where it happened',
  why: 'Why it happened',
  how: 'How it happened',

  // Classification
  type: 'Action | Decision | Milestone | Exception | Communication',
  category: 'Business | Technical | Operational | Financial | Customer',
  severity: 'Info | Warning | Error | Critical',

  // Context
  source: 'Event source system',
  sourceId: 'ID in source system',
  correlationId: 'Correlation ID for tracing',

  // Data
  data: 'Event payload (JSON)',
  metadata: 'Additional metadata (JSON)',

  // Relationships
  subject: 'Primary entity involved ->Thing',
  related: ['Related entities ->Thing'],
  parent: 'Parent event ->Event',
  children: ['Child events <-Event.parent'],

  // Audit
  recorded: 'When recorded (date)',
  recordedBy: 'Recorded by ->Person | Agent',
})
