/**
 * Agent - An AI that performs work
 *
 * An autonomous entity that executes tasks on behalf of a business.
 */

import { $, Noun } from '../../core/nouns'

export const Agent = Noun({
  $type: 'Agent',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Agent name',
  role: 'Agent role/responsibility',
  capabilities: 'Agent capabilities',

  // Configuration
  model: 'claude-3-5-sonnet | claude-3-opus | gpt-4o | gpt-4-turbo',
  systemPrompt: 'System prompt',
  temperature: 'Temperature (0-1)',
  maxTokens: 'Max tokens per response',

  // Tools
  tools: $.Tool.where((t: any) => t.agent),
  toolCount: $.count($.tools),

  // Autonomy
  autonomyLevel: 'Full | Supervised | Approval-Required | Manual',
  approvalThreshold: 'Impact level requiring approval',

  // Business
  business: $.Business,

  // Metrics
  tasks: $.Task.where((t: any) => t.agent),
  tasksCompleted: $.count($.tasks),
  successRate: $.avg($.tasks.success),

  // Generated
  instructions: 'Detailed instructions for {name} agent with role {role}',
})
