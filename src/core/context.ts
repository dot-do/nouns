/**
 * $Context - Type-Safe Runtime Context
 *
 * Provides a fluent, type-safe API for querying and traversing the object graph.
 *
 * Usage:
 *   const $ = $Context('https://startups.studio')
 *   const startup = await $.Startup('headless.ly')
 *   const products = await startup.products()
 *
 * Or with auto-inferred context:
 *   import { $ } from 'nouns.do'
 *   const startup = await $.Startup('headless.ly')  // context from env/config
 */

import type { NounType, NounMeta } from './nouns.js'

// =============================================================================
// CONTEXT INFERENCE
// =============================================================================

declare const globalThis: {
  __DO_CONTEXT__?: string
  __DO_CONFIG__?: { $context?: string }
  request?: Request
}

/**
 * Infer context from environment
 */
export function inferContext(): string {
  // 1. Explicit global
  if (typeof globalThis !== 'undefined' && globalThis.__DO_CONTEXT__) {
    return globalThis.__DO_CONTEXT__
  }

  // 2. Cloudflare Worker request
  if (typeof globalThis !== 'undefined' && globalThis.request?.headers?.get('host')) {
    return `https://${globalThis.request.headers.get('host')}`
  }

  // 3. Environment variables
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.DO_CONTEXT) return process.env.DO_CONTEXT
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    if (process.env.CF_PAGES_URL) return process.env.CF_PAGES_URL
    if (process.env.WORKER_HOST) return `https://${process.env.WORKER_HOST}`
  }

  // 4. Config file
  if (typeof globalThis !== 'undefined' && globalThis.__DO_CONFIG__?.$context) {
    return globalThis.__DO_CONFIG__.$context
  }

  // 5. Default
  return 'http://localhost:3000'
}

/**
 * Set the global context explicitly
 */
export function setContext(url: string): void {
  if (typeof globalThis !== 'undefined') {
    globalThis.__DO_CONTEXT__ = url
  }
}

// =============================================================================
// INSTANCE TYPE - Runtime representation of a Noun instance
// =============================================================================

/**
 * An instance is a Noun with $id that can traverse relationships
 */
export type Instance<T extends Record<string, any> = any> = T & {
  $id: string
  $type: string
  $context: string
  $meta: NounMeta

  // Relationship traversal returns promises
  // These are added dynamically based on the Noun's link definitions
}

/**
 * A collection of instances with query methods
 */
export interface Collection<T extends Instance = Instance> extends Promise<T[]> {
  // Query methods
  where(predicate: (item: T) => boolean): Collection<T>
  first(): Promise<T | undefined>
  count(): Promise<number>

  // Traversal methods - return flattened collections
  flatMap<U extends Instance>(fn: (item: T) => Promise<U[]> | U[]): Collection<U>

  // Array-like
  map<U>(fn: (item: T) => U): Promise<U[]>
  filter(predicate: (item: T) => boolean): Collection<T>
  find(predicate: (item: T) => boolean): Promise<T | undefined>
}

// =============================================================================
// CONTEXT PROXY
// =============================================================================

export interface ContextAPI {
  $context: string

  // Get instance by $id
  get<T extends Instance>(id: string): Promise<T>

  // Query by type
  query<T extends Instance>(type: string, filter?: Record<string, any>): Collection<T>

  // Type accessors - Startup, Product, Customer, etc.
  // These are added dynamically
  [typeName: string]: any
}

/**
 * Create a context-bound $ proxy
 */
export function $Context(contextUrl: string): ContextAPI {
  const ctx = contextUrl

  // Storage adapter (in-memory for now, would be DB in production)
  const store = new Map<string, Instance>()

  // Get instance by $id
  async function get<T extends Instance>(id: string): Promise<T> {
    // Normalize ID
    const fullId = id.startsWith('http') ? id : `${ctx}/${id}`

    // Check store
    if (store.has(fullId)) {
      return store.get(fullId) as T
    }

    // In production, would fetch from DB
    throw new Error(`Instance not found: ${fullId}`)
  }

  // Query instances by type
  function query<T extends Instance>(type: string, filter?: Record<string, any>): Collection<T> {
    // Create a lazy collection
    const promise = (async () => {
      const results: T[] = []

      for (const [id, instance] of store.entries()) {
        if (instance.$type === type || instance.$meta?.type === type) {
          // Apply filter
          if (filter) {
            const matches = Object.entries(filter).every(([key, value]) => {
              const instanceValue = (instance as any)[key]
              // Handle $id references
              if (instanceValue?.$id) {
                return instanceValue.$id === value || instanceValue.$id === value?.$id
              }
              return instanceValue === value
            })
            if (!matches) continue
          }

          results.push(instance as T)
        }
      }

      return results
    })()

    // Extend promise with collection methods
    return Object.assign(promise, {
      where(predicate: (item: T) => boolean): Collection<T> {
        return Object.assign(
          promise.then(items => items.filter(predicate)),
          collectionMethods<T>()
        ) as Collection<T>
      },
      first(): Promise<T | undefined> {
        return promise.then(items => items[0])
      },
      count(): Promise<number> {
        return promise.then(items => items.length)
      },
      flatMap<U extends Instance>(fn: (item: T) => Promise<U[]> | U[]): Collection<U> {
        const newPromise = promise.then(async items => {
          const results: U[] = []
          for (const item of items) {
            const mapped = await fn(item)
            results.push(...mapped)
          }
          return results
        })
        return Object.assign(newPromise, collectionMethods<U>()) as Collection<U>
      },
      map<U>(fn: (item: T) => U): Promise<U[]> {
        return promise.then(items => items.map(fn))
      },
      filter(predicate: (item: T) => boolean): Collection<T> {
        return Object.assign(
          promise.then(items => items.filter(predicate)),
          collectionMethods<T>()
        ) as Collection<T>
      },
      find(predicate: (item: T) => boolean): Promise<T | undefined> {
        return promise.then(items => items.find(predicate))
      },
    }) as Collection<T>
  }

  // Helper for collection methods
  function collectionMethods<T extends Instance>() {
    return {
      where: (predicate: (item: T) => boolean) => query<T>('', {}), // placeholder
      first: () => Promise.resolve(undefined as T | undefined),
      count: () => Promise.resolve(0),
      flatMap: <U extends Instance>(fn: (item: T) => Promise<U[]> | U[]) => query<U>('', {}),
      map: <U>(fn: (item: T) => U) => Promise.resolve([] as U[]),
      filter: (predicate: (item: T) => boolean) => query<T>('', {}),
      find: (predicate: (item: T) => boolean) => Promise.resolve(undefined as T | undefined),
    }
  }

  // Register an instance in the store
  function register<T extends Instance>(instance: T): T {
    if (instance.$id) {
      store.set(instance.$id, instance)
    }
    return instance
  }

  // Create the proxy
  const proxy = new Proxy({} as ContextAPI, {
    get(_, prop: string) {
      // Special properties
      if (prop === '$context') return ctx
      if (prop === 'get') return get
      if (prop === 'query') return query
      if (prop === 'register') return register
      if (prop === '_store') return store // for debugging

      // Type accessor: $.Startup, $.Product, etc.
      // Returns a function that queries or gets by ID
      return (idOrFilter?: string | Record<string, any>) => {
        if (typeof idOrFilter === 'string') {
          // $.Startup('headless.ly') - get by ID/slug
          const fullId = idOrFilter.startsWith('http')
            ? idOrFilter
            : `${ctx}/${idOrFilter}`

          // Try exact match first
          if (store.has(fullId)) {
            return Promise.resolve(store.get(fullId))
          }

          // Try finding by slug in the context
          for (const [id, instance] of store.entries()) {
            if (
              (instance.$type === prop || instance.$meta?.type === prop) &&
              (id.endsWith(`/${idOrFilter}`) || id === idOrFilter || (instance as any).slug === idOrFilter)
            ) {
              return Promise.resolve(instance)
            }
          }

          // Not found - return query that might resolve later
          return get(fullId)
        }

        // $.Startup() or $.Startup({ filter }) - query all of type
        return query(prop, idOrFilter)
      }
    },
  })

  return proxy
}

// =============================================================================
// DEFAULT $ - Uses inferred context
// =============================================================================

let _defaultContext: ContextAPI | null = null

export function getDefaultContext(): ContextAPI {
  if (!_defaultContext) {
    _defaultContext = $Context(inferContext())
  }
  return _defaultContext
}

// Re-export as $ for convenience
// This is overridden in the main index to combine with field definition $
