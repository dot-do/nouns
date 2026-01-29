/**
 * Syntax Exploration - Finding the Right Patterns
 *
 * Working through real entities to discover natural syntax.
 */

// =============================================================================
// MARKER LEGEND (proposed)
// =============================================================================
//
// FIELD SOURCES:
//   (none)     Plain string description = input (user provides)
//   {var}      Has variable interpolation = generate (AI creates)
//   =>         Arrow/function = compute (derived)
//   @          At symbol = sync (from external)
//   #          Hash = aggregate (from collection)
//
// RELATIONSHIPS:
//   ->         Outgoing link
//   <-         Incoming link
//   <~         Fuzzy match (ground against reference)
//   ~>         Fuzzy search (find similar)
//
// MODIFIERS:
//   ?          Optional
//   !          Required
//   []         Array
//
// =============================================================================

// Placeholder for exploration - not real implementation yet
const DO = (def: any) => def
const Source = (config: any) => (def: any) => def

// =============================================================================
// EXTERNAL ENTITIES (Namespaced)
// =============================================================================

/**
 * Stripe namespace - external payment system
 */
export namespace Stripe {

  /**
   * Stripe.Customer - fully external, we observe
   */
  export const Customer = Source({
    base: 'https://api.stripe.com/v1',
    path: '/customers/{id}',
    auth: '$env.STRIPE_SECRET_KEY',
  })({
    $type: 'Stripe.Customer',

    // Identity (we provide to look up)
    id: 'cus_xxx',

    // All fields synced from Stripe
    email: '@.email',
    name: '@.name',
    phone: '@.phone',
    currency: '@.currency',
    balance: '@.balance',           // in cents
    created: '@.created',           // unix timestamp
    delinquent: '@.delinquent',
    metadata: '@.metadata',
  })

  /**
   * Stripe.Subscription - external, but we can modify
   */
  export const Subscription = Source({
    base: 'https://api.stripe.com/v1',
    path: '/subscriptions/{id}',
    auth: '$env.STRIPE_SECRET_KEY',
  })({
    $type: 'Stripe.Subscription',

    id: 'sub_xxx',

    // Synced (readonly)
    status: '@.status',
    currentPeriodStart: '@.current_period_start',
    currentPeriodEnd: '@.current_period_end',
    cancelAtPeriodEnd: '@.cancel_at_period_end',
    customer: '@.customer',         // Stripe customer ID

    // Price info
    priceId: '@.items.data[0].price.id',
    amount: '@.items.data[0].price.unit_amount',
    interval: '@.items.data[0].price.recurring.interval',

    // Actions (affect Stripe)
    $cancel: 'DELETE /subscriptions/{id}',
    $pause: 'POST /subscriptions/{id}/pause',
    $resume: 'POST /subscriptions/{id}/resume',
  })

  /**
   * Stripe.PaymentIntent - represents a payment
   */
  export const PaymentIntent = Source({
    base: 'https://api.stripe.com/v1',
    path: '/payment_intents/{id}',
    auth: '$env.STRIPE_SECRET_KEY',
  })({
    $type: 'Stripe.PaymentIntent',

    id: 'pi_xxx',

    amount: '@.amount',
    currency: '@.currency',
    status: '@.status',             // requires_payment_method | succeeded | etc
    customer: '@.customer',
    created: '@.created',

    // Computed
    amountDollars: '=> amount / 100',
  })
}

// =============================================================================
// GITHUB NAMESPACE
// =============================================================================

export namespace Github {

  export const Repo = Source({
    base: 'https://api.github.com',
    path: '/repos/{owner}/{name}',
    auth: '$env.GITHUB_TOKEN',
  })({
    $type: 'Github.Repo',

    // Identity (input - we choose what to observe)
    owner: 'Repository owner',
    name: 'Repository name',

    // Synced from GitHub
    description: '@.description',
    stars: '@.stargazers_count',
    forks: '@.forks_count',
    openIssues: '@.open_issues_count',
    language: '@.language',
    topics: '@.topics',
    license: '@.license.spdx_id',
    private: '@.private',
    archived: '@.archived',
    pushedAt: '@.pushed_at',

    // Computed
    fullName: '=> `${owner}/${name}`',
    url: '=> `https://github.com/${owner}/${name}`',

    // Actions
    $star: 'PUT /user/starred/{owner}/{name}',
    $unstar: 'DELETE /user/starred/{owner}/{name}',
    $fork: 'POST /repos/{owner}/{name}/forks',
  })

  export const User = Source({
    base: 'https://api.github.com',
    path: '/users/{username}',
    auth: '$env.GITHUB_TOKEN',
  })({
    $type: 'Github.User',

    username: 'GitHub username',

    name: '@.name',
    bio: '@.bio',
    company: '@.company',
    location: '@.location',
    email: '@.email',
    followers: '@.followers',
    following: '@.following',
    publicRepos: '@.public_repos',
  })
}

// =============================================================================
// GOOGLE ADS NAMESPACE
// =============================================================================

export namespace Google {

  export const Campaign = Source({
    base: 'https://googleads.googleapis.com/v14',
    path: '/customers/{customerId}/campaigns/{id}',
    auth: '$env.GOOGLE_ADS_TOKEN',
  })({
    $type: 'Google.Campaign',

    customerId: 'Google Ads customer ID',
    id: 'Campaign ID',

    // Editable settings (we can push changes)
    name: '@.name | editable',
    status: '@.status | editable',  // ENABLED | PAUSED | REMOVED
    budget: '@.campaign_budget | editable',

    // Metrics (readonly)
    impressions: '@.metrics.impressions',
    clicks: '@.metrics.clicks',
    conversions: '@.metrics.conversions',
    cost: '@.metrics.cost_micros',

    // Computed
    ctr: '=> clicks / impressions',
    cpc: '=> cost / clicks / 1000000',
    cpa: '=> cost / conversions / 1000000',

    // Actions
    $pause: { status: 'PAUSED' },
    $enable: { status: 'ENABLED' },
    $setBudget: '(amount) => { budget: amount }',
  })
}

// =============================================================================
// DOMAIN ENTITIES (Our Business)
// =============================================================================

/**
 * Customer - OUR entity, may link to Stripe
 */
export const Customer = DO({
  $type: 'Customer',

  // Input (we collect)
  email: 'Customer email!',         // ! = required
  name: 'Customer name',
  company: 'Company name',

  // Link to external (optional)
  stripe: '-> Stripe.Customer?',

  // Passthrough from Stripe (when linked)
  balance: '=> stripe?.balance ?? 0',
  isDelinquent: '=> stripe?.delinquent ?? false',

  // Aggregated from relationships
  totalSpend: '#sum(payments.amount)',
  orderCount: '#count(orders)',
  mrr: '#sum(subscriptions[active].amount)',

  // Generated
  segment: 'Analyze {company} customer segment',
  healthScore: 'Calculate health score for {name} based on {totalSpend}, {orderCount}',

  // Relationships
  payments: '<- Payment.customer',
  orders: '<- Order.customer',
  subscriptions: '<- Subscription.customer',
})

/**
 * Subscription - bridges internal and Stripe
 */
export const Subscription = DO({
  $type: 'Subscription',

  // Our identity
  id: 'uuid',

  // Relationships
  customer: '-> Customer!',
  plan: '-> Plan!',

  // Link to Stripe (source of truth for billing state)
  stripe: '-> Stripe.Subscription?',

  // Passthrough from Stripe
  status: '=> stripe?.status ?? "pending"',
  currentPeriodEnd: '=> stripe?.currentPeriodEnd',
  cancelAtPeriodEnd: '=> stripe?.cancelAtPeriodEnd ?? false',

  // Our data
  startedAt: '@now',                // Set on creation
  trialEndsAt: 'Trial end date?',

  // Computed
  isActive: '=> status === "active"',
  isTrialing: '=> status === "trialing"',
  daysRemaining: '=> daysBetween(now(), currentPeriodEnd)',

  // Actions (affect Stripe via linked subscription)
  $cancel: '=> stripe.$cancel()',
  $changePlan: '(newPlan) => stripe.$update({ price: newPlan.stripePriceId })',
})

/**
 * Product - what we sell
 */
export const Product = DO({
  $type: 'Product',

  // Input
  name: 'Product name!',
  description: 'Product description',
  type: 'SaaS | API | Mobile | Desktop',

  // Optional link to code
  repo: '-> Github.Repo?',

  // Passthrough from GitHub
  stars: '=> repo?.stars ?? 0',
  forks: '=> repo?.forks ?? 0',

  // Relationships
  plans: '[-> Plan]',

  // Aggregated
  activeSubscriptions: '#count(subscriptions[active])',
  mrr: '#sum(subscriptions[active].plan.price)',
  arr: '=> mrr * 12',

  // Generated
  tagline: 'One-line tagline for {name}',
  positioning: 'Positioning statement for {name} vs competitors',
})

/**
 * Plan - pricing tier
 */
export const Plan = DO({
  $type: 'Plan',

  name: 'Plan name!',
  price: 'Monthly price (number)!',
  interval: 'month | year',
  features: ['Plan features'],

  // Link to Stripe Price
  stripePrice: '-> Stripe.Price?',

  // Relationships
  product: '-> Product!',
  subscriptions: '<- Subscription.plan',

  // Aggregated
  subscriberCount: '#count(subscriptions[active])',
  revenue: '=> subscriberCount * price',
})

// =============================================================================
// GENERATED ENTITIES
// =============================================================================

/**
 * IdealCustomerProfile - AI generated, grounded to reference
 */
export const IdealCustomerProfile = DO({
  $type: 'IdealCustomerProfile',

  // Grounding (fuzzy match to reference data)
  occupation: '<~ Occupation',
  industry: '<~ Industry',

  // Generated fields
  as: 'What role/title? Ground to {occupation}',
  at: 'What company type? Ground to {industry}',
  doing: 'What activity are they doing?',
  using: 'What tools are they using?',
  toAchieve: 'What goal are they trying to achieve?',

  // Deep generation
  painPoints: ['Top 5 pain points for {as} at {at}'],
  motivations: ['Key motivations for {as}'],
  objections: ['Common objections from {as}'],
  triggers: ['Buying triggers for {as}'],

  // Computed
  sentence: '=> `${as} at ${at} are ${doing} using ${using} to ${toAchieve}`',

  // Relationships
  problem: '<- Problem.icps',
  market: 'Size the market for {sentence} -> Market',
})

/**
 * Market - AI generated market analysis
 */
export const Market = DO({
  $type: 'Market',

  // Generated from ICP
  tam: 'Estimate TAM for {icp.sentence} (number)',
  sam: 'Estimate SAM for {icp.sentence} (number)',
  som: 'Estimate SOM for {icp.sentence} (number)',

  // Analysis
  trends: ['Market trends for {icp.industry}'],
  competitors: ['Competitors solving {problem.statement}'],
  gaps: ['Market gaps for {problem.statement}'],

  // Relationships
  icp: '<- IdealCustomerProfile.market',
  problem: '=> icp.problem',
})

/**
 * LandingPage - generated, then deployed
 */
export const LandingPage = DO({
  $type: 'LandingPage',

  // Input
  slug: 'URL path!',

  // Generated content
  hero: {
    headline: 'Hero headline for {offer}',
    subheadline: 'Subheadline for {offer}',
    cta: 'CTA button text for {offer}',
  },
  problemSection: 'Problem section for {problem}',
  solutionSection: 'Solution section for {solution}',
  socialProof: 'Social proof for {icp}',

  // Deployment state (external)
  deployment: '-> Vercel.Deployment?',
  url: '=> deployment?.url',
  deployedAt: '=> deployment?.createdAt',

  // Metrics (external)
  analytics: '-> Analytics.Page?',
  visitors: '=> analytics?.visitors ?? 0',
  conversions: '=> analytics?.conversions ?? 0',
  conversionRate: '=> visitors > 0 ? conversions / visitors : 0',

  // Relationships
  offer: '-> Offer!',
  experiment: '-> Experiment!',

  // Actions
  $deploy: '=> Vercel.$deploy(this.render())',
  $undeploy: '=> deployment?.$delete()',
})

// =============================================================================
// REFERENCE ENTITIES (Seeded)
// =============================================================================

/**
 * Occupation - seeded from O*NET, readonly
 */
export const Occupation = DO({
  $type: 'Occupation',

  $seed: {
    source: 'https://www.onetcenter.org/taxonomy/occupations.tsv',
    format: 'tsv',
    key: 'onet_soc_code',
  },

  // All fields from seed (readonly)
  onetCode: '@seed.onet_soc_code',
  title: '@seed.title',
  description: '@seed.description',
})

/**
 * Industry - seeded from NAICS, readonly
 */
export const Industry = DO({
  $type: 'Industry',

  $seed: {
    source: 'https://www.census.gov/naics/',
    format: 'xlsx',
    key: 'naics_code',
  },

  naicsCode: '@seed.naics_code',
  title: '@seed.title',
  description: '@seed.description',
})

// =============================================================================
// METRICS ENTITIES (Aggregated)
// =============================================================================

/**
 * RevenueMetrics - aggregated from payments/subscriptions
 */
export const RevenueMetrics = DO({
  $type: 'RevenueMetrics',

  // Link to business
  business: '-> Business!',

  // Aggregated metrics
  mrr: '#sum(subscriptions[active].plan.price)',
  arr: '=> mrr * 12',
  totalRevenue: '#sum(payments.amount)',

  // Customer metrics
  totalCustomers: '#count(customers)',
  activeSubscriptions: '#count(subscriptions[active])',
  arpu: '=> mrr / activeSubscriptions',

  // Churn (requires historical data)
  churnedMrr: '#sum(subscriptions[churned_this_month].plan.price)',
  churnRate: '=> churnedMrr / (mrr + churnedMrr)',
  nrr: '=> (mrr + expansionMrr - contractionMrr - churnedMrr) / previousMrr',

  // Unit economics
  ltv: '=> arpu / churnRate',
  cac: '=> totalMarketingSpend / newCustomers',
  ltvCacRatio: '=> ltv / cac',
})

// =============================================================================
// SYNTAX SUMMARY
// =============================================================================

/**
 * FINAL SYNTAX PROPOSAL:
 *
 * FIELD SOURCES:
 *   'Description'              -> Input (user provides)
 *   'Text with {var}'          -> Generate (AI creates)
 *   '=> expression'            -> Compute (derived)
 *   '@source.path'             -> Sync (external)
 *   '#agg(collection.field)'   -> Aggregate (collection)
 *   '@seed.field'              -> Seed (reference data)
 *
 * RELATIONSHIPS:
 *   '-> Type'                  -> Link to
 *   '<- Type.field'            -> Link from
 *   '<~ Type'                  -> Fuzzy match
 *   '~> Type'                  -> Fuzzy search
 *   '[-> Type]'                -> Array of links
 *
 * MODIFIERS:
 *   '!'                        -> Required
 *   '?'                        -> Optional
 *   '| editable'               -> Synced but can push changes
 *
 * ACTIONS:
 *   '$actionName: ...'         -> Action that affects external system
 *
 * NAMESPACES:
 *   'Source.Type'              -> External entity (Stripe.Customer)
 */
