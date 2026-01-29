/**
 * nouns.do - Business-as-Code
 *
 * Define businesses as code. Run them with AI.
 *
 * @example
 * ```typescript
 * import { $, Noun, Startup } from 'nouns.do'
 *
 * // Define a type
 * const MySaaS = SaaS({ $type: 'MySaaS', feature: 'Special feature' })
 *
 * // Create an instance
 * const myApp = new MySaaS({
 *   $id: 'https://my.app',
 *   name: 'My App',
 * })
 *
 * // Query at runtime ($ infers context from environment)
 * const startups = await $.Startup()
 * const headlessly = await $.Startup('headless.ly')
 * const products = await headlessly.products()
 * ```
 */

// =============================================================================
// CORE
// =============================================================================

// Noun factory and helpers
export { Noun, $, isType, isInstance, getType, getId } from './core/nouns'
export type { NounMeta, NounType } from './core/nouns'

// $Context for runtime queries
export { $Context, inferContext, setContext, getDefaultContext } from './core/context'
export type { Instance, Collection, ContextAPI } from './core/context'

// Serialization - Code/Functions <-> JSON/Data
export {
  stringifyNoun,
  serializeNoun,
  serializeInstance,
  parseNoun,
  generateWorkerCode,
  generateLoaderModule,
  extractFunctionBody,
  extractFunctionParams,
  detectExports,
} from './core/serialize'
export type { SerializedNoun, SerializedInstance, GeneratorOptions, LoaderOptions, LoaderModule } from './core/serialize'

// =============================================================================
// NOUNS - All type definitions
// =============================================================================

export * from './nouns'
