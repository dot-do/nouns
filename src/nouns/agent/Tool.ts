/**
 * Tool - A capability available to an agent
 *
 * A function or API that an agent can invoke.
 */

import { $, Noun } from '../../core/nouns'

export const Tool = Noun({
  $type: 'Tool',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Tool name',
  description: 'What the tool does',

  // Definition
  function: 'Tool function name',
  parameters: 'Tool parameters schema',

  // Agent
  agent: $.Agent,

  // API
  api: $.API,
  endpoint: 'API endpoint to call',

  // Generated
  documentation: 'Documentation for {name} tool',
})
