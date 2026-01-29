/**
 * Workflow - A sequence of tasks
 *
 * An orchestrated series of steps that accomplish a goal.
 */

import { $, Noun } from '../../core/nouns'

export const Workflow = Noun({
  $type: 'Workflow',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Workflow name',
  description: 'What this workflow accomplishes',

  // Configuration
  trigger: 'What triggers this workflow',
  steps: 'Workflow steps',

  // Status
  status: 'Draft | Active | Paused | Archived',

  // Relationships
  business: $.Business,
  runs: $.WorkflowRun.where((r: any) => r.workflow),

  // Aggregated
  totalRuns: $.count($.runs),
  successRate: $.avg($.runs.success),
})
