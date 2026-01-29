/**
 * Task - A unit of work
 *
 * Something that needs to be done, assigned to an agent or person.
 */

import { $, Noun } from '../../core/nouns'

export const Task = Noun({
  $type: 'Task',
  $context: 'https://schema.org.ai',

  // Identity
  title: 'Task title',
  description: 'Task description',

  // Status
  status: 'Pending | In Progress | Completed | Failed | Cancelled',
  priority: 'Low | Medium | High | Urgent',

  // Assignment
  agent: $.Agent,
  assignee: $.Person,

  // Timing
  createdAt: 'Created timestamp',
  startedAt: 'Started timestamp',
  completedAt: 'Completed timestamp',
  dueAt: 'Due timestamp',

  // Result
  result: 'Task result',
  error: 'Error if failed',
  success: ($: any) => $.status === 'Completed',

  // Duration
  duration: ($: any) => $.completedAt && $.startedAt ? $.completedAt - $.startedAt : null,
})
