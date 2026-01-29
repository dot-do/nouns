/**
 * HeadlessSaaS - API-first SaaS for AI agents
 *
 * A SaaS product designed for AI consumers, not humans.
 * No UI, pure API, built for automation.
 */

import { $ } from '../../core/nouns'
import { SaaS } from './SaaS'

export const HeadlessSaaS = SaaS({
  $type: 'HeadlessSaaS',

  // Headless = API-first, no UI, for AI/automation
  hasUI: false,
  apiFirst: true,
  consumers: 'AI agents and automation, not humans',

  // API
  apiBase: 'API base URL',
  apiDocs: 'API documentation URL',
  sdks: $.SDK.where((s: any) => s.product),

  // Generated
  aiUseCases: 'AI use cases for {name}',
})
