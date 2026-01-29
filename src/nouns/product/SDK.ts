/**
 * SDK - Software Development Kit
 *
 * A library that wraps an API for a specific language/runtime.
 */

import { $ } from '../../core/nouns'
import { Product } from './Product'

export const SDK = Product({
  $type: 'SDK',

  productKind: 'SDK',

  // SDK-specific
  language: 'JavaScript | TypeScript | Python | Go | Rust | Ruby | Java | C#',
  runtime: 'Node | Browser | Deno | Bun | Edge',
  packageName: 'Package name (npm, pip, etc)',
  packageManager: 'npm | pip | cargo | gem | maven | nuget',

  // Versions
  version: 'Current version',
  minVersion: 'Minimum supported version',

  // Stats
  downloads: 'Total downloads',
  weeklyDownloads: 'Weekly downloads',

  // Links
  npm: $.NPM.Package,
  npmDownloads: $.npm.downloads,

  // For API/Product
  api: $.API,
  product: $.Product,

  // Generated
  installGuide: 'Installation guide for {name}',
})
