/**
 * $ - Type-Safe Field Definitions
 *
 * @dotdo/nouns - Core abstractions (open source)
 * nouns.do     - Managed service (PaaS with auth, hosting, etc.)
 *
 * import { $, Noun } from '@dotdo/nouns'
 * // or
 * import { $, Noun } from 'nouns.do'
 */

// =============================================================================
// $ PROXY IMPLEMENTATION
// =============================================================================

function create$(): any {
  const sources = new Set([
    'Stripe', 'Github', 'Google', 'Vercel', 'NPM', 'DNS', 'WHOIS',
    'Order', 'Subscription', 'Customer', 'Plan', 'Product',
    'Occupation', 'Industry', 'Market', 'ICP',
  ])

  function path(segments: string[] = []): any {
    return new Proxy(function(){}, {
      get(_, prop: string) {
        if (prop === '$') return { path: segments }
        if (prop === 'then') return undefined
        if (prop === 'where') return (fn: any) => ({ $query: segments.join('.'), filter: fn })

        // Root-level functions
        if (segments.length === 0) {
          if (prop === 'sum') return (p: any) => ({ $sum: p.$.path.join('.') })
          if (prop === 'count') return (p: any) => ({ $count: p.$.path.join('.') })
          if (prop === 'avg') return (p: any) => ({ $avg: p.$.path.join('.') })
          if (prop === 'min') return (p: any) => ({ $min: p.$.path.join('.') })
          if (prop === 'max') return (p: any) => ({ $max: p.$.path.join('.') })
          if (prop === 'fuzzy') return (p: any) => ({ $fuzzy: p.$.path.join('.') })
        }

        return path([...segments, prop])
      },
    })
  }

  return path()
}

export const $ = create$()

// =============================================================================
// NOUN DEFINITION
// =============================================================================

const EXTERNAL_SOURCES = new Set(['Stripe', 'Github', 'Google', 'Vercel', 'NPM', 'DNS', 'WHOIS'])

export function Noun<T extends Record<string, any>>(definition: T): T & { $meta: any } {
  const meta = {
    type: definition.$type,
    extends: definition.$extends,          // Schema inheritance (schema.org, etc.)
    input: {} as Record<string, any>,      // User provides
    sync: {} as Record<string, any>,       // From external API
    ref: {} as Record<string, any>,        // Reference to own field
    compute: {} as Record<string, any>,    // Derived function
    aggregate: {} as Record<string, any>,  // Aggregated from collection
    generate: {} as Record<string, any>,   // AI generates
    link: {} as Record<string, any>,       // Relationship
    fuzzy: {} as Record<string, any>,      // Fuzzy match
  }

  for (const [key, value] of Object.entries(definition)) {
    if (key.startsWith('$')) continue

    // Plain string = input or generate
    if (typeof value === 'string') {
      // Check for {var} pattern = generate
      if (value.includes('{') && value.includes('}')) {
        meta.generate[key] = { prompt: value }
      } else {
        meta.input[key] = { description: value }
      }
      continue
    }

    // Aggregations: $sum, $count, $avg, etc. (check for string value to avoid proxy false positives)
    if (typeof value?.$sum === 'string') { meta.aggregate[key] = { op: 'sum', path: value.$sum }; continue }
    if (typeof value?.$count === 'string') { meta.aggregate[key] = { op: 'count', path: value.$count }; continue }
    if (typeof value?.$avg === 'string') { meta.aggregate[key] = { op: 'avg', path: value.$avg }; continue }
    if (typeof value?.$min === 'string') { meta.aggregate[key] = { op: 'min', path: value.$min }; continue }
    if (typeof value?.$max === 'string') { meta.aggregate[key] = { op: 'max', path: value.$max }; continue }

    // Fuzzy match (check for string value)
    if (typeof value?.$fuzzy === 'string') { meta.fuzzy[key] = { target: value.$fuzzy }; continue }

    // Query (relationship with filter - check for string value)
    if (typeof value?.$query === 'string') { meta.link[key] = { target: value.$query, filter: value.filter }; continue }

    // Path reference (from $ proxy) - check BEFORE function check since proxy returns function
    if (value?.$ && Array.isArray(value.$.path)) {
      const path = value.$.path
      if (path.length === 0) continue

      // External source: Stripe.Customer, Github.Repo
      if (EXTERNAL_SOURCES.has(path[0])) {
        meta.sync[key] = { source: path.join('.') }
      }
      // Reference to own field: stripe.balance
      else {
        meta.ref[key] = { path: path.join('.') }
      }
      continue
    }

    // Function = compute (check after $ proxy since proxy is also a function)
    if (typeof value === 'function') {
      meta.compute[key] = { fn: value }
      continue
    }
  }

  return { ...definition, $meta: meta }
}

// =============================================================================
// EXAMPLE NOUNS
// =============================================================================

/**
 * Customer
 */
export const Customer = Noun({
  $type: 'Customer',

  // Input (plain strings)
  name: 'Customer name',
  email: 'Customer email',
  company: 'Company name',

  // Link to external
  stripe: $.Stripe.Customer,

  // Passthrough from linked
  balance: $.stripe.balance,
  delinquent: $.stripe.delinquent,

  // Computed
  displayName: ($: any) => `${$.name} (${$.company})`,
  balanceDollars: ($: any) => $.balance / 100,

  // Aggregated
  totalSpend: $.sum($.orders.amount),
  orderCount: $.count($.orders),

  // Relationships
  orders: $.Order.where((o: any) => o.customer),
})

/**
 * Product
 */
export const Product = Noun({
  $type: 'Product',

  // Input
  name: 'Product name',
  description: 'Product description',

  // Optional external link
  repo: $.Github.Repo,

  // Passthrough (optional chaining in computed)
  stars: ($: any) => $.repo?.stars ?? 0,

  // Aggregated
  mrr: $.sum($.subscriptions.plan.price),

  // Computed
  arr: ($: any) => $.mrr * 12,
})

/**
 * ICP - Generated
 */
export const ICP = Noun({
  $type: 'IdealCustomerProfile',

  // Grounding
  occupation: $.fuzzy($.Occupation),
  industry: $.fuzzy($.Industry),

  // Generated (template literals with $ refs would be detected)
  // For now, plain strings that reference fields
  as: 'Role grounded to occupation',
  at: 'Company type grounded to industry',
  painPoints: 'Pain points for {as} at {at}',

  // Computed
  sentence: ($: any) => `${$.as} at ${$.at}`,
})

/**
 * Startup - extends schema.org/Organization
 */
export const Startup = Noun({
  $type: 'Startup',
  $extends: 'https://schema.org/Organization',

  // Input (maps to schema.org properties)
  name: 'Company name',
  description: 'Company description',
  url: 'Company website',
  foundingDate: 'Date founded',

  // Additional startup-specific fields
  stage: 'Seed | Series A | Series B | Series C | Growth',
  vertical: 'Industry vertical',

  // Generated
  pitch: 'Elevator pitch for {name} in {vertical}',
  positioning: 'Positioning statement for {name}',

  // Computed
  ageYears: ($: any) => {
    const founded = new Date($.foundingDate)
    return Math.floor((Date.now() - founded.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  },

  // External enrichment
  github: $.Github.User,
  githubRepos: $.count($.github.publicRepos),

  // Relationships
  founders: $.Founder.where((f: any) => f.startup),
  products: $.Product.where((p: any) => p.company),

  // Aggregated
  totalMrr: $.sum($.products.mrr),
  teamSize: $.count($.founders),
})

// =============================================================================
// TEST
// =============================================================================

console.log('Customer:', JSON.stringify(Customer.$meta, null, 2))
console.log('\nProduct:', JSON.stringify(Product.$meta, null, 2))
console.log('\nStartup:', JSON.stringify(Startup.$meta, null, 2))
console.log('\n$.stripe.balance:', $.stripe.balance.$)
console.log('$.Stripe.Customer:', $.Stripe.Customer.$)
console.log('$.sum($.orders.amount):', $.sum($.orders.amount))
