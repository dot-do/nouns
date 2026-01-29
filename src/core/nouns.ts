/**
 * Core Nouns - Business-as-Code from First Principles
 *
 * @dotdo/nouns - Core abstractions (open source)
 * nouns.do     - Managed service (PaaS)
 *
 * Every Noun has:
 *   $id      - URL identity (instance)
 *   $type    - Semantic type (class)
 *   $context - Vocabulary namespace
 *   $extends - Inheritance chain
 */

// =============================================================================
// $ PROXY - Type-Safe Field Definitions
// =============================================================================

const EXTERNAL_SOURCES = new Set([
  'Stripe', 'Github', 'Google', 'Vercel', 'NPM', 'DNS', 'WHOIS',
  'Slack', 'Discord', 'Linear', 'Notion', 'Airtable',
])

function create$(): any {
  function path(segments: string[] = []): any {
    return new Proxy(function(){}, {
      get(_, prop: string) {
        if (prop === '$') return { path: segments }
        if (prop === 'then') return undefined
        if (prop === 'where') return (fn: any) => ({ $query: segments.join('.'), filter: fn })

        // Aggregation functions at root level
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
// NOUN FACTORY
// =============================================================================

export interface NounMeta {
  type: string
  context?: string
  extends?: string | string[]
  input: Record<string, { description: string }>
  sync: Record<string, { source: string }>
  ref: Record<string, { path: string }>
  compute: Record<string, { fn?: Function }>
  aggregate: Record<string, { op: string; path: string }>
  generate: Record<string, { prompt: string }>
  link: Record<string, { target: string; filter?: Function }>
  fuzzy: Record<string, { target: string }>
}

// The return type: a callable that's also the Noun with $meta
// Supports both regular calls (for type extension) and `new` calls (for instance creation)
export type NounType<T> = T & { $meta: NounMeta } & {
  // Call signature for extending types: Startup({ $type: 'MyStartup', ... })
  <E extends Record<string, any>>(extension: E): NounType<E>
  // Constructor signature for creating instances: new Startup({ $id: 'https://...', ... })
  new <E extends Record<string, any>>(extension: E): NounType<E>
}

export function Noun<T extends Record<string, any>>(definition: T): NounType<T> {
  const meta: NounMeta = {
    type: definition.$type,
    context: definition.$context ?? definition.$extends?.$meta?.context,
    extends: definition.$extends?.$meta?.type ?? definition.$extends,
    input: {},
    sync: {},
    ref: {},
    compute: {},
    aggregate: {},
    generate: {},
    link: {},
    fuzzy: {},
  }

  for (const [key, value] of Object.entries(definition)) {
    if (key.startsWith('$')) continue

    // Plain string = input or generate
    if (typeof value === 'string') {
      if (value.includes('{') && value.includes('}')) {
        meta.generate[key] = { prompt: value }
      } else {
        meta.input[key] = { description: value }
      }
      continue
    }

    // Aggregations (check for string values to avoid proxy false positives)
    if (typeof value?.$sum === 'string') { meta.aggregate[key] = { op: 'sum', path: value.$sum }; continue }
    if (typeof value?.$count === 'string') { meta.aggregate[key] = { op: 'count', path: value.$count }; continue }
    if (typeof value?.$avg === 'string') { meta.aggregate[key] = { op: 'avg', path: value.$avg }; continue }
    if (typeof value?.$min === 'string') { meta.aggregate[key] = { op: 'min', path: value.$min }; continue }
    if (typeof value?.$max === 'string') { meta.aggregate[key] = { op: 'max', path: value.$max }; continue }

    // Fuzzy match
    if (typeof value?.$fuzzy === 'string') { meta.fuzzy[key] = { target: value.$fuzzy }; continue }

    // Query (relationship with filter)
    if (typeof value?.$query === 'string') { meta.link[key] = { target: value.$query, filter: value.filter }; continue }

    // Path reference (from $ proxy) - check BEFORE function
    if (value?.$ && Array.isArray(value.$.path)) {
      const p = value.$.path
      if (p.length === 0) continue

      if (EXTERNAL_SOURCES.has(p[0])) {
        meta.sync[key] = { source: p.join('.') }
      } else {
        meta.ref[key] = { path: p.join('.') }
      }
      continue
    }

    // Function = compute
    if (typeof value === 'function') {
      meta.compute[key] = { fn: value }
      continue
    }
  }

  // Create the extend function - calling a Noun creates an extended Noun or instance
  // Using regular function (not arrow) so we can detect `new.target`
  function extend<E extends Record<string, any>>(this: any, extension: E): NounType<E> {
    // `new Startup({...})` = create instance (new.target is set)
    // `Startup({...})` with $id = also create instance (for backwards compat)
    // `Startup({ $type: ... })` = extend type
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const calledWithNew = typeof new.target !== 'undefined'
    const hasIdNoType = '$id' in extension && !('$type' in extension)
    const isInstance = calledWithNew || hasIdNoType

    return Noun({
      ...extension,
      $extends: extend as any,
      // For instances, inherit the $type from parent
      ...(isInstance && !extension.$type ? { $type: meta.type } : {}),
    })
  }

  // Attach all definition properties and $meta to the function
  // Use defineProperty to handle read-only properties like 'name'
  for (const [key, value] of Object.entries({ ...definition, $meta: meta })) {
    try {
      Object.defineProperty(extend, key, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    } catch {
      // Skip if property can't be defined (shouldn't happen with configurable: true)
    }
  }

  return extend as NounType<T>
}

// =============================================================================
// TYPE VS INSTANCE HELPERS
// =============================================================================

/**
 * Check if a Noun is a type definition (has $type, no $id)
 */
export function isType(noun: any): boolean {
  return noun?.$type !== undefined && noun?.$id === undefined
}

/**
 * Check if a Noun is an instance (has $id)
 */
export function isInstance(noun: any): boolean {
  return noun?.$id !== undefined
}

/**
 * Get the type name of a Noun or instance
 */
export function getType(noun: any): string | undefined {
  return noun?.$meta?.type ?? noun?.$type
}

/**
 * Get the $id of an instance
 */
export function getId(noun: any): string | undefined {
  return noun?.$id
}

// =============================================================================
// CONTEXT - schema.org.ai vocabulary
// =============================================================================

const ctx = 'https://schema.org.ai'

// =============================================================================
// BASE TYPES (schema.org foundations)
// =============================================================================

/**
 * Thing - The most generic type
 */
export const Thing = Noun({
  $type: 'Thing',
  $context: ctx,

  name: 'Name',
  description: 'Description',
  url: 'URL',
  image: 'Image URL',
})

/**
 * Person - A human being (extends Thing via callable)
 */
export const Person = Thing({
  $type: 'Person',

  email: 'Email address',
  phone: 'Phone number',

  // Computed
  displayName: ($: any) => $.name || $.email?.split('@')[0] || 'Unknown',
})

/**
 * Organization - A company, institution, etc. (extends Thing via callable)
 */
export const Organization = Thing({
  $type: 'Organization',

  legalName: 'Legal entity name',
  foundingDate: 'Date founded',
  location: 'Headquarters location',

  // Relationships
  founders: $.Person.where((p: any) => p.foundedOrganization),
  employees: $.Person.where((p: any) => p.worksFor),

  // Aggregated
  teamSize: $.count($.employees),
})

// =============================================================================
// BUSINESS LAYER - Core business abstractions
// =============================================================================

/**
 * Business - An organization that creates, delivers, and captures value
 */
export const Business = Organization({
  $type: 'Business',

  // Identity
  domain: 'Primary domain',
  stage: 'Idea | Validation | Growth | Scale | Mature',

  // External links
  stripe: $.Stripe.Account,
  github: $.Github.Organization,

  // Metrics (synced from Stripe)
  stripeBalance: $.stripe.balance,
  stripeCurrency: $.stripe.default_currency,

  // Relationships
  products: $.Product.where((p: any) => p.business),
  customers: $.Customer.where((c: any) => c.business),
  subscriptions: $.Subscription.where((s: any) => s.business),

  // Aggregated metrics
  mrr: $.sum($.subscriptions.amount),
  arr: ($: any) => $.mrr * 12,
  customerCount: $.count($.customers),
  productCount: $.count($.products),

  // Generated
  positioning: 'Positioning statement for {name} in {industry}',
})

/**
 * Startup - An early-stage business designed for rapid growth
 */
export const Startup = Business({
  $type: 'Startup',

  // Startup-specific
  vertical: 'Industry vertical',
  runway: 'Months of runway remaining',
  raised: 'Total funding raised',
  valuation: 'Current valuation',

  // Computed
  burnRate: ($: any) => $.raised / $.runway,
  monthsToDefault: ($: any) => $.stripeBalance / $.burnRate,

  // Generated
  pitch: 'Elevator pitch for {name} solving {problem}',
  whyNow: 'Why now is the right time for {name}',
})

// =============================================================================
// CUSTOMER LAYER - Who we serve
// =============================================================================

/**
 * Customer - Someone who pays for value
 */
export const Customer = Person({
  $type: 'Customer',

  // Our data
  company: 'Company name',
  segment: 'Enterprise | SMB | Startup | Consumer',

  // Business relationship
  business: $.Business,

  // External link
  stripe: $.Stripe.Customer,

  // Synced from Stripe
  balance: $.stripe.balance,
  delinquent: $.stripe.delinquent,
  currency: $.stripe.currency,

  // Computed
  balanceDollars: ($: any) => $.balance / 100,
  isHealthy: ($: any) => !$.delinquent && $.balance >= 0,

  // Relationships
  subscriptions: $.Subscription.where((s: any) => s.customer),
  invoices: $.Invoice.where((i: any) => i.customer),
  payments: $.Payment.where((p: any) => p.customer),

  // Aggregated
  totalSpend: $.sum($.payments.amount),
  subscriptionCount: $.count($.subscriptions),
  lifetimeValue: $.sum($.invoices.total),

  // Generated
  healthScore: 'Calculate health score for {name} based on {totalSpend}, {subscriptionCount}, {delinquent}',
})

/**
 * Lead - A potential customer
 */
export const Lead = Person({
  $type: 'Lead',

  // Source tracking
  source: 'Organic | Paid | Referral | Outbound',
  campaign: 'Campaign that generated this lead',
  landingPage: 'Landing page URL',

  // Qualification
  status: 'New | Contacted | Qualified | Converted | Lost',
  score: 'Lead score (0-100)',

  // Business relationship
  business: $.Business,

  // Generated
  qualificationNotes: 'Qualification notes for {name} from {company}',
  nextAction: 'Recommended next action for {name}',
})

/**
 * IdealCustomerProfile - AI-generated customer archetype
 */
export const IdealCustomerProfile = Noun({
  $type: 'IdealCustomerProfile',
  $context: ctx,

  // Grounding (fuzzy match to reference data)
  occupation: $.fuzzy($.Occupation),
  industry: $.fuzzy($.Industry),

  // Generated persona
  as: 'Role/title grounded to {occupation}',
  at: 'Company type grounded to {industry}',
  doing: 'What activity are they doing?',
  using: 'What tools are they using?',
  toAchieve: 'What goal are they trying to achieve?',

  // Deep generation
  painPoints: 'Top 5 pain points for {as} at {at}',
  motivations: 'Key motivations for {as}',
  objections: 'Common objections from {as}',
  triggers: 'Buying triggers for {as}',

  // Computed
  sentence: ($: any) => `${$.as} at ${$.at} are ${$.doing} using ${$.using} to ${$.toAchieve}`,

  // Relationships
  problem: $.Problem,
  business: $.Business,
})

// =============================================================================
// PRODUCT LAYER - What we sell
// =============================================================================

/**
 * Product - Something a business sells
 */
export const Product = Thing({
  $type: 'Product',

  // Identity
  slug: 'URL-safe identifier',
  productKind: 'SaaS | API | Mobile | Desktop | Physical | Service',

  // Business relationship
  business: $.Business,

  // External links
  repo: $.Github.Repo,
  stripeProduct: $.Stripe.Product,

  // Synced from GitHub
  stars: $.repo.stargazers_count,
  forks: $.repo.forks_count,
  openIssues: $.repo.open_issues_count,

  // Relationships
  plans: $.Plan.where((p: any) => p.product),
  features: $.Feature.where((f: any) => f.product),
  subscriptions: $.Subscription.where((s: any) => s.product),

  // Aggregated
  activeSubscriptions: $.count($.subscriptions),
  mrr: $.sum($.subscriptions.amount),
  arr: ($: any) => $.mrr * 12,

  // Generated
  tagline: 'One-line tagline for {name}',
  positioning: 'Positioning statement for {name}',
})

/**
 * Plan - A pricing tier for a product
 */
export const Plan = Noun({
  $type: 'Plan',
  $context: ctx,

  // Identity
  name: 'Plan name',
  slug: 'URL-safe identifier',

  // Pricing
  price: 'Monthly price in cents',
  interval: 'month | year',
  currency: 'USD | EUR | GBP',

  // Limits
  limits: 'Usage limits as JSON',

  // Relationships
  product: $.Product,
  stripePrice: $.Stripe.Price,
  subscriptions: $.Subscription.where((s: any) => s.plan),

  // Aggregated
  subscriberCount: $.count($.subscriptions),
  revenue: ($: any) => $.subscriberCount * $.price,
})

/**
 * Subscription - A customer's ongoing relationship with a product
 */
export const Subscription = Noun({
  $type: 'Subscription',
  $context: ctx,

  // Relationships
  customer: $.Customer,
  product: $.Product,
  plan: $.Plan,
  business: $.Business,

  // External link (source of truth for billing)
  stripe: $.Stripe.Subscription,

  // Synced from Stripe
  status: $.stripe.status,
  currentPeriodStart: $.stripe.current_period_start,
  currentPeriodEnd: $.stripe.current_period_end,
  cancelAtPeriodEnd: $.stripe.cancel_at_period_end,

  // Our data
  startedAt: 'When subscription started',
  trialEndsAt: 'When trial ends',

  // Computed
  isActive: ($: any) => $.status === 'active' || $.status === 'trialing',
  isTrialing: ($: any) => $.status === 'trialing',
  amount: ($: any) => $.plan.price,
  daysRemaining: ($: any) => Math.ceil(($.currentPeriodEnd - Date.now()) / 86400000),

  // Actions (affect Stripe)
  $cancel: '=> stripe.$cancel()',
  $pause: '=> stripe.$pause()',
  $resume: '=> stripe.$resume()',
  $changePlan: '(newPlan) => stripe.$update({ price: newPlan.stripePrice.id })',
})

// =============================================================================
// AI/AUTONOMOUS LAYER - Agents that run the business
// =============================================================================

/**
 * Agent - An AI that performs work
 */
export const Agent = Noun({
  $type: 'Agent',
  $context: ctx,

  // Identity
  name: 'Agent name',
  role: 'Agent role/responsibility',

  // Configuration
  model: 'claude-3-5-sonnet | claude-3-opus | gpt-4o',
  systemPrompt: 'System prompt for the agent',
  tools: 'Available tools as JSON',
  autonomyLevel: 'full | supervised | approval-required',

  // Relationships
  business: $.Business,
  tasks: $.Task.where((t: any) => t.agent),
  decisions: $.Decision.where((d: any) => d.agent),

  // Aggregated
  tasksCompleted: $.count($.tasks),
  decisionsApproved: $.count($.decisions),

  // Generated
  capabilities: 'List capabilities for {role} agent',
})

/**
 * Task - A unit of work for an agent
 */
export const Task = Noun({
  $type: 'Task',
  $context: ctx,

  // Identity
  title: 'Task title',
  description: 'Task description',

  // Status
  status: 'pending | in_progress | completed | failed',
  priority: 'low | medium | high | urgent',

  // Relationships
  agent: $.Agent,
  business: $.Business,
  parent: $.Task,
  subtasks: $.Task.where((t: any) => t.parent),

  // Results
  result: 'Task result as JSON',
  error: 'Error message if failed',

  // Timing
  createdAt: 'When task was created',
  startedAt: 'When task started',
  completedAt: 'When task completed',

  // Computed
  duration: ($: any) => $.completedAt ? $.completedAt - $.startedAt : null,
})

/**
 * Decision - A choice made by an agent that may need approval
 */
export const Decision = Noun({
  $type: 'Decision',
  $context: ctx,

  // Identity
  title: 'Decision title',
  description: 'What decision needs to be made',

  // Options
  options: 'Available options as JSON',
  recommendation: 'Recommended option',
  reasoning: 'Why this recommendation',

  // Status
  status: 'pending | approved | rejected | auto-approved',
  approvedBy: $.Person,
  approvedAt: 'When approved',

  // Relationships
  agent: $.Agent,
  task: $.Task,
  business: $.Business,

  // Thresholds
  impactLevel: 'low | medium | high | critical',
  requiresApproval: ($: any) => $.impactLevel === 'high' || $.impactLevel === 'critical',
})

/**
 * Workflow - A sequence of tasks that accomplish a goal
 */
export const Workflow = Noun({
  $type: 'Workflow',
  $context: ctx,

  // Identity
  name: 'Workflow name',
  description: 'What this workflow accomplishes',

  // Configuration
  trigger: 'What triggers this workflow',
  steps: 'Workflow steps as JSON',

  // Status
  status: 'draft | active | paused | archived',

  // Relationships
  business: $.Business,
  runs: $.WorkflowRun.where((r: any) => r.workflow),

  // Aggregated
  totalRuns: $.count($.runs),
  successRate: $.avg($.runs.success),
})

// =============================================================================
// MARKET LAYER - Understanding the market
// =============================================================================

/**
 * Problem - A problem worth solving
 */
export const Problem = Noun({
  $type: 'Problem',
  $context: ctx,

  // Identity
  statement: 'Problem statement',
  context: 'Context and background',

  // Relationships
  business: $.Business,
  icps: $.IdealCustomerProfile.where((i: any) => i.problem),
  solutions: $.Solution.where((s: any) => s.problem),

  // Generated
  severity: 'How severe is {statement} for {icps}',
  frequency: 'How often do {icps} experience {statement}',
  alternatives: 'Current alternatives to solve {statement}',
})

/**
 * Solution - How we solve a problem
 */
export const Solution = Noun({
  $type: 'Solution',
  $context: ctx,

  // Identity
  name: 'Solution name',
  description: 'How we solve the problem',

  // Relationships
  problem: $.Problem,
  product: $.Product,
  business: $.Business,

  // Generated
  uniqueValue: 'Unique value proposition for {name}',
  differentiation: 'How {name} differs from alternatives',
})

/**
 * Market - A market opportunity
 */
export const Market = Noun({
  $type: 'Market',
  $context: ctx,

  // Relationships
  icp: $.IdealCustomerProfile,
  problem: $.Problem,
  business: $.Business,

  // Generated market sizing
  tam: 'Total addressable market for {icp.sentence}',
  sam: 'Serviceable addressable market for {icp.sentence}',
  som: 'Serviceable obtainable market for {icp.sentence}',

  // Generated analysis
  trends: 'Market trends for {icp.industry}',
  competitors: 'Competitors solving {problem.statement}',
  gaps: 'Market gaps for {problem.statement}',
})

// =============================================================================
// CONTENT LAYER - Marketing and communication
// =============================================================================

/**
 * Offer - A specific value proposition for a specific audience
 */
export const Offer = Noun({
  $type: 'Offer',
  $context: ctx,

  // Relationships
  icp: $.IdealCustomerProfile,
  solution: $.Solution,
  product: $.Product,
  business: $.Business,

  // Generated
  headline: 'Headline for {icp.as} about {solution.name}',
  subheadline: 'Subheadline expanding on {headline}',
  cta: 'Call-to-action for {icp.as}',
  benefits: 'Key benefits of {solution.name} for {icp.as}',
  objectionHandlers: 'Handle objections: {icp.objections}',
})

/**
 * LandingPage - A page designed to convert visitors
 */
export const LandingPage = Noun({
  $type: 'LandingPage',
  $context: ctx,

  // Identity
  slug: 'URL path',
  title: 'Page title',

  // Relationships
  offer: $.Offer,
  experiment: $.Experiment,
  business: $.Business,

  // Generated content
  heroHeadline: 'Hero headline for {offer.headline}',
  heroSubheadline: 'Hero subheadline for {offer.subheadline}',
  heroCta: 'Hero CTA: {offer.cta}',
  problemSection: 'Problem section for {offer.icp.painPoints}',
  solutionSection: 'Solution section for {offer.solution}',
  benefitsSection: 'Benefits section for {offer.benefits}',
  socialProof: 'Social proof for {offer.icp}',

  // Deployment
  deployment: $.Vercel.Deployment,
  url: $.deployment.url,
  deployedAt: $.deployment.createdAt,

  // Analytics
  analytics: $.Analytics.Page,
  visitors: $.analytics.visitors,
  conversions: $.analytics.conversions,
  conversionRate: ($: any) => $.visitors > 0 ? $.conversions / $.visitors : 0,

  // Actions
  $deploy: '=> Vercel.$deploy(this.render())',
  $undeploy: '=> deployment?.$delete()',
})

/**
 * Experiment - A test of a hypothesis
 */
export const Experiment = Noun({
  $type: 'Experiment',
  $context: ctx,

  // Identity
  name: 'Experiment name',
  hypothesis: 'What we believe will happen',

  // Configuration
  variants: 'Variant configurations as JSON',
  trafficSplit: 'Traffic split percentages',
  metric: 'Primary metric to measure',
  minSampleSize: 'Minimum sample size for significance',

  // Status
  status: 'draft | running | paused | completed',
  startedAt: 'When experiment started',
  endedAt: 'When experiment ended',

  // Relationships
  business: $.Business,
  landingPages: $.LandingPage.where((l: any) => l.experiment),

  // Results
  winner: 'Winning variant',
  confidence: 'Statistical confidence',
  lift: 'Improvement percentage',

  // Generated
  analysis: 'Analyze results of {name} testing {hypothesis}',
  learnings: 'Key learnings from {name}',
  nextSteps: 'Recommended next steps after {name}',
})

// =============================================================================
// REFERENCE DATA - Seeded from authoritative sources
// =============================================================================

/**
 * Occupation - From O*NET (readonly)
 */
export const Occupation = Noun({
  $type: 'Occupation',
  $context: ctx,

  $seed: {
    source: 'https://www.onetcenter.org/taxonomy/occupations.tsv',
    format: 'tsv',
    key: 'onet_soc_code',
  },

  onetCode: 'O*NET SOC code',
  title: 'Occupation title',
  description: 'Occupation description',
})

/**
 * Industry - From NAICS (readonly)
 */
export const Industry = Noun({
  $type: 'Industry',
  $context: ctx,

  $seed: {
    source: 'https://www.census.gov/naics/',
    format: 'xlsx',
    key: 'naics_code',
  },

  naicsCode: 'NAICS code',
  title: 'Industry title',
  description: 'Industry description',
})

// =============================================================================
// EXPORT ALL NOUNS
// =============================================================================

export const Nouns = {
  // Base
  Thing,
  Person,
  Organization,

  // Business
  Business,
  Startup,

  // Customer
  Customer,
  Lead,
  IdealCustomerProfile,

  // Product
  Product,
  Plan,
  Subscription,

  // AI/Autonomous
  Agent,
  Task,
  Decision,
  Workflow,

  // Market
  Problem,
  Solution,
  Market,

  // Content
  Offer,
  LandingPage,
  Experiment,

  // Reference
  Occupation,
  Industry,
}

// =============================================================================
// TEST
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('=== Business-as-Code Core Nouns ===\n')

  console.log('Startup:', JSON.stringify(Startup.$meta, null, 2))
  console.log('\nCustomer:', JSON.stringify(Customer.$meta, null, 2))
  console.log('\nSubscription:', JSON.stringify(Subscription.$meta, null, 2))
  console.log('\nAgent:', JSON.stringify(Agent.$meta, null, 2))
  console.log('\nIdealCustomerProfile:', JSON.stringify(IdealCustomerProfile.$meta, null, 2))

  console.log('\n=== Inheritance Chain ===')
  console.log('Startup extends:', Startup.$meta.extends)
  console.log('Business extends:', Business.$meta.extends)
  console.log('Organization extends:', Organization.$meta.extends)
  console.log('Thing extends:', Thing.$meta.extends)
}
