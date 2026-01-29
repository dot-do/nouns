/**
 * Noun Serialization - Code/Functions <-> JSON/Data
 *
 * Converts Nouns between executable code and serializable data formats.
 * Supports both compiled deployment (workers) and dynamic execution.
 *
 * Key patterns (from primitives research):
 * - Functions serialized via .toString() as strings
 * - No eval() - functions embedded at code generation time
 * - Export detection via regex patterns
 * - Worker code generated as complete strings
 */

import { Noun } from './nouns.js'
import type { NounMeta, NounType } from './nouns.js'

// =============================================================================
// SERIALIZED NOUN FORMAT
// =============================================================================

/**
 * A fully serialized Noun ready for JSON storage or transmission
 */
export interface SerializedNoun {
  $type: string
  $context?: string
  $extends?: string | string[]

  // All fields with their sources and values
  fields: Record<
    string,
    {
      source: 'input' | 'sync' | 'ref' | 'compute' | 'aggregate' | 'generate' | 'link' | 'fuzzy'
      value: any
      // For compute/link: the function as a string
      fn?: string
    }
  >

  // The full $meta for reconstruction
  $meta: NounMeta
}

/**
 * A serialized instance (has $id and concrete values)
 */
export interface SerializedInstance extends SerializedNoun {
  $id: string
  values: Record<string, any>
}

// =============================================================================
// STRINGIFY - Convert Noun/Instance to JSON
// =============================================================================

/**
 * Serialize a Noun type definition to JSON
 */
export function stringifyNoun(noun: NounType<any>): string {
  const serialized = serializeNoun(noun)
  return JSON.stringify(serialized, null, 2)
}

/**
 * Serialize a Noun to a plain object (for JSON.stringify)
 */
export function serializeNoun(noun: NounType<any>): SerializedNoun {
  const meta = noun.$meta

  const fields: SerializedNoun['fields'] = {}

  // Input fields
  for (const key of Object.keys(meta.input)) {
    fields[key] = { source: 'input', value: meta.input[key].description }
  }

  // Sync fields (external sources)
  for (const key of Object.keys(meta.sync)) {
    fields[key] = { source: 'sync', value: meta.sync[key].source }
  }

  // Ref fields (passthrough from other fields)
  for (const key of Object.keys(meta.ref)) {
    fields[key] = { source: 'ref', value: meta.ref[key].path }
  }

  // Compute fields (functions)
  for (const key of Object.keys(meta.compute)) {
    fields[key] = {
      source: 'compute',
      value: null,
      fn: meta.compute[key].fn?.toString(),
    }
  }

  // Aggregate fields
  for (const key of Object.keys(meta.aggregate)) {
    const agg = meta.aggregate[key]
    fields[key] = { source: 'aggregate', value: { op: agg.op, path: agg.path } }
  }

  // Generate fields (AI prompts)
  for (const key of Object.keys(meta.generate)) {
    fields[key] = { source: 'generate', value: meta.generate[key].prompt }
  }

  // Link fields (relationships)
  for (const key of Object.keys(meta.link)) {
    const link = meta.link[key]
    fields[key] = {
      source: 'link',
      value: link.target,
      fn: link.filter?.toString(),
    }
  }

  // Fuzzy fields
  for (const key of Object.keys(meta.fuzzy)) {
    fields[key] = { source: 'fuzzy', value: meta.fuzzy[key].target }
  }

  return {
    $type: meta.type,
    $context: meta.context,
    $extends: meta.extends,
    fields,
    $meta: meta,
  }
}

/**
 * Serialize an instance (Noun with $id and values)
 */
export function serializeInstance(instance: any): SerializedInstance {
  // Get the type from $meta or figure it out
  const meta: NounMeta = instance.$meta ?? {
    type: instance.$type,
    context: instance.$context,
    extends: instance.$extends,
    input: {},
    sync: {},
    ref: {},
    compute: {},
    aggregate: {},
    generate: {},
    link: {},
    fuzzy: {},
  }

  // Extract actual values
  const values: Record<string, any> = {}
  for (const [key, value] of Object.entries(instance)) {
    if (!key.startsWith('$') && typeof value !== 'function') {
      values[key] = value
    }
  }

  return {
    $id: instance.$id,
    $type: meta.type,
    $context: meta.context ?? instance.$context,
    $extends: meta.extends,
    fields: {}, // Type fields come from the Noun definition
    $meta: meta,
    values,
  }
}

// =============================================================================
// PARSE - Convert JSON back to Noun/Instance
// =============================================================================

/**
 * Parse a serialized Noun back into an executable Noun
 *
 * NOTE: This reconstructs the Noun structure but compute/link functions
 * are NOT re-evaluated. For full function execution, use generateWorkerCode()
 */
export function parseNoun(json: string | SerializedNoun): NounType<any> {
  const serialized = typeof json === 'string' ? JSON.parse(json) : json

  // Reconstruct the definition object
  const definition: Record<string, any> = {
    $type: serialized.$type,
    $context: serialized.$context,
    // Note: $extends is a reference, not reconstructed
  }

  // Reconstruct fields
  for (const [key, field] of Object.entries(serialized.fields)) {
    const f = field as SerializedNoun['fields'][string]

    switch (f.source) {
      case 'input':
      case 'generate':
        definition[key] = f.value
        break

      case 'sync':
      case 'ref':
        // Reconstruct as a path reference
        // These need the $ proxy to be meaningful
        definition[key] = { $: { path: f.value.split('.') } }
        break

      case 'aggregate':
        // Reconstruct as aggregation
        const { op, path } = f.value
        definition[key] = { [`$${op}`]: path }
        break

      case 'compute':
      case 'link':
        // Functions are stored as strings
        // We store them but they're not executable without worker generation
        if (f.fn) {
          // Store a placeholder that indicates this is a serialized function
          definition[key] = { $fn: f.fn }
        }
        break

      case 'fuzzy':
        definition[key] = { $fuzzy: f.value }
        break
    }
  }

  return Noun(definition)
}

// =============================================================================
// WORKER CODE GENERATION
// =============================================================================

/**
 * Generate worker-deployable code for a Noun
 *
 * This creates a string of JavaScript code that can be deployed to a worker.
 * Functions are embedded directly - no eval() needed.
 */
export function generateWorkerCode(noun: NounType<any>, options: GeneratorOptions = {}): string {
  const { exportName = 'NounType' } = options
  const serialized = serializeNoun(noun)

  // Collect compute functions
  const computeFunctions: string[] = []
  for (const [key, field] of Object.entries(serialized.fields)) {
    const f = field as SerializedNoun['fields'][string]
    if (f.source === 'compute' && f.fn) {
      computeFunctions.push(`  ${key}: ${f.fn},`)
    }
  }

  // Collect link filters
  const linkFilters: string[] = []
  for (const [key, field] of Object.entries(serialized.fields)) {
    const f = field as SerializedNoun['fields'][string]
    if (f.source === 'link' && f.fn) {
      linkFilters.push(`  '${key}': ${f.fn},`)
    }
  }

  // Generate the worker code
  return `/**
 * Generated Noun Worker Code
 * Type: ${serialized.$type}
 * Generated: ${new Date().toISOString()}
 *
 * This code is ready to deploy to a Cloudflare Worker.
 */

// Compute functions (embedded, not eval'd)
const computeFunctions = {
${computeFunctions.join('\n')}
};

// Link filter functions
const linkFilters = {
${linkFilters.join('\n')}
};

// Noun metadata
const $meta = ${JSON.stringify(serialized.$meta, null, 2)};

// Execute a compute function
function compute(key, $) {
  const fn = computeFunctions[key];
  if (!fn) return undefined;
  return fn($);
}

// Execute a link filter
function filterLink(key, items, context) {
  const filter = linkFilters[key];
  if (!filter) return items;
  return items.filter(item => filter(item, context));
}

// Export the Noun definition
export const ${exportName} = {
  $type: ${JSON.stringify(serialized.$type)},
  $context: ${JSON.stringify(serialized.$context)},
  $meta,
  compute,
  filterLink,
};

// Worker fetch handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // GET /meta - return Noun metadata
    if (url.pathname === '/meta') {
      return Response.json($meta);
    }

    // POST /compute/:field - execute a compute function
    if (request.method === 'POST' && url.pathname.startsWith('/compute/')) {
      const field = url.pathname.slice('/compute/'.length);
      const $ = await request.json();
      const result = compute(field, $);
      return Response.json({ field, result });
    }

    // POST /filter/:link - filter a link relationship
    if (request.method === 'POST' && url.pathname.startsWith('/filter/')) {
      const link = url.pathname.slice('/filter/'.length);
      const { items, context } = await request.json();
      const result = filterLink(link, items, context);
      return Response.json({ link, result });
    }

    return new Response('Noun Worker', { status: 200 });
  }
};
`
}

export interface GeneratorOptions {
  exportName?: string
}

// =============================================================================
// DYNAMIC LOADER GENERATION (for worker_loaders)
// =============================================================================

/**
 * Generate a module definition for Cloudflare worker_loaders
 *
 * This returns an object compatible with the worker_loaders API:
 * { mainModule: string, modules: Record<string, string> }
 */
export function generateLoaderModule(
  noun: NounType<any>,
  options: LoaderOptions = {}
): LoaderModule {
  const { id = noun.$meta.type, externalModules = {} } = options

  const workerCode = generateWorkerCode(noun, { exportName: 'NounType' })

  return {
    id,
    mainModule: 'worker.js',
    modules: {
      'worker.js': workerCode,
      ...externalModules,
    },
    compatibilityDate: '2024-01-01',
  }
}

export interface LoaderOptions {
  id?: string
  externalModules?: Record<string, string>
}

export interface LoaderModule {
  id: string
  mainModule: string
  modules: Record<string, string>
  compatibilityDate: string
}

// =============================================================================
// FUNCTION EXTRACTION HELPERS
// =============================================================================

/**
 * Extract function body from a function string
 */
export function extractFunctionBody(fnString: string): string {
  // Arrow function: ($) => $.mrr * 12
  const arrowMatch = fnString.match(/^\s*\(?\s*([^)]*)\)?\s*=>\s*(.+)$/s)
  if (arrowMatch) {
    const body = arrowMatch[2].trim()
    // If it's a single expression (no braces), return it
    if (!body.startsWith('{')) {
      return body
    }
    // If it has braces, extract the inner content
    return body.slice(1, -1).trim()
  }

  // Regular function: function($) { return $.mrr * 12 }
  const funcMatch = fnString.match(/function\s*\([^)]*\)\s*\{(.+)\}/s)
  if (funcMatch) {
    return funcMatch[1].trim()
  }

  return fnString
}

/**
 * Extract parameter names from a function string
 */
export function extractFunctionParams(fnString: string): string[] {
  // Arrow function
  const arrowMatch = fnString.match(/^\s*\(?\s*([^)=]*)\)?\s*=>/)
  if (arrowMatch) {
    const params = arrowMatch[1].trim()
    if (!params) return []
    return params.split(',').map(p => p.trim())
  }

  // Regular function
  const funcMatch = fnString.match(/function\s*\(([^)]*)\)/)
  if (funcMatch) {
    const params = funcMatch[1].trim()
    if (!params) return []
    return params.split(',').map(p => p.trim())
  }

  return []
}

/**
 * Detect exports in module code (for dynamic loading)
 */
export function detectExports(moduleCode: string): string[] {
  const names = new Set<string>()

  // Match: exports.name = ...
  const dotPattern = /exports\.(\w+)\s*=/g
  let match
  while ((match = dotPattern.exec(moduleCode)) !== null) {
    names.add(match[1])
  }

  // Match: export const name = ...
  const esConstPattern = /export\s+(?:const|let|var)\s+(\w+)\s*=/g
  while ((match = esConstPattern.exec(moduleCode)) !== null) {
    names.add(match[1])
  }

  // Match: export function name(...)
  const esFunctionPattern = /export\s+(?:async\s+)?function\*?\s+(\w+)\s*\(/g
  while ((match = esFunctionPattern.exec(moduleCode)) !== null) {
    names.add(match[1])
  }

  // Match: export class name
  const esClassPattern = /export\s+class\s+(\w+)/g
  while ((match = esClassPattern.exec(moduleCode)) !== null) {
    names.add(match[1])
  }

  // Match: export default (special case)
  if (/export\s+default\s+/.test(moduleCode)) {
    names.add('default')
  }

  return Array.from(names)
}

// =============================================================================
// TESTS
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const nouns = await import('./nouns.js')
  const { Startup } = nouns

  console.log('=== Noun Serialization Tests ===\n')

  // Test serialization
  console.log('1. Serialize Startup:')
  const serialized = serializeNoun(Startup)
  console.log(JSON.stringify(serialized, null, 2).slice(0, 500) + '...\n')

  // Test worker code generation
  console.log('2. Generate Worker Code:')
  const workerCode = generateWorkerCode(Startup)
  console.log(workerCode.slice(0, 800) + '...\n')

  // Test function extraction
  console.log('3. Function Extraction:')
  const fn = '($) => $.mrr * 12'
  console.log(`  Input: ${fn}`)
  console.log(`  Body: ${extractFunctionBody(fn)}`)
  console.log(`  Params: ${extractFunctionParams(fn)}`)

  // Test loader module
  console.log('\n4. Loader Module:')
  const loader = generateLoaderModule(Startup)
  console.log(`  ID: ${loader.id}`)
  console.log(`  Main Module: ${loader.mainModule}`)
  console.log(`  Modules: ${Object.keys(loader.modules).join(', ')}`)
}
