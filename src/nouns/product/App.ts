/**
 * App - Application
 *
 * A user-facing application (web, mobile, desktop, CLI).
 */

import { $ } from '../../core/nouns'
import { Product } from './Product'

export const App = Product({
  $type: 'App',

  productKind: 'App',

  // App-specific
  platform: 'Web | iOS | Android | Desktop | CLI',
  framework: 'Next.js | React | Vue | Svelte | React Native | Flutter | Electron',

  // Deployment
  deployment: $.Vercel.Deployment,
  deployUrl: $.deployment.url,

  // Analytics
  analytics: $.Analytics.Page,
  visitors: $.analytics.visitors,
  conversions: $.analytics.conversions,

  // Generated
  featureList: 'Key features of {name}',
})
