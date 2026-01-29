/**
 * Field Type Semantics
 *
 * Every field has a SOURCE (where data comes from) and MUTABILITY (who can change it).
 *
 * =============================================================================
 * FIELD SOURCES
 * =============================================================================
 *
 * $input     - User provides this data (editable)
 * $generate  - AI creates this data (regenerable)
 * $compute   - Derived from other fields (auto-updates)
 * $sync      - Synced from external API (read-only)
 * $aggregate - Aggregated from related entities (read-only)
 *
 * =============================================================================
 * IMPLICIT vs EXPLICIT
 * =============================================================================
 *
 * IMPLICIT (inferred from syntax):
 *   name: 'Company name'              → $input (plain description)
 *   pitch: 'Generate for {name}'      → $generate (has {variables})
 *   full: (x) => x.first + x.last     → $compute (function)
 *   stars: '$resource.stars'          → $sync (from $enrich)
 *
 * EXPLICIT (when you need to override):
 *   name: { $input: 'Company name', required: true }
 *   pitch: { $generate: 'Generate for {name}', model: 'opus' }
 *   mrr: { $sync: '$stripe.mrr', refresh: '1h' }
 *   arr: { $aggregate: 'sum(subscriptions.price * 12)' }
 *
 * =============================================================================
 */

import { DO } from './do/do'

// =============================================================================
// EXAMPLE: Startup with explicit field types
// =============================================================================

/**
 * Startup - demonstrates all field source types
 */
export const StartupExplicit = DO({
  $type: 'Startup',
  $version: 1,

  // =========================================
  // $input - User provides (editable)
  // =========================================

  // Implicit (plain string = $input)
  name: 'Startup name',

  // Explicit (with validation)
  problem: {
    $input: 'Problem statement',
    required: true,
    minLength: 10,
  },

  stage: {
    $input: 'Seed | SeriesA | SeriesB | SeriesC | Growth',
    default: 'Seed',
  },

  foundedAt: {
    $input: 'Founded date (date)',
    default: 'now',
  },

  // =========================================
  // $generate - AI creates (regenerable)
  // =========================================

  // Implicit (has {variables})
  pitch: 'Generate elevator pitch for {name} solving {problem}',

  // Explicit (with model preference)
  oneLiner: {
    $generate: 'One sentence description of {name}',
    model: 'haiku', // fast/cheap for simple generation
  },

  analysis: {
    $generate: 'Analyze {name} market potential',
    model: 'opus', // best for complex analysis
    schema: {
      summary: 'Brief summary',
      score: 'Score 1-10 (number)',
      risks: ['Key risks'],
      opportunities: ['Key opportunities'],
    },
  },

  // =========================================
  // $compute - Derived (auto-updates)
  // =========================================

  // Implicit (function)
  displayName: (s: any) => `${s.name} (${s.stage})`,

  // Explicit (formula)
  runway: {
    $compute: 'bankBalance / monthlyBurn',
    unit: 'months',
  },

  // =========================================
  // $sync - External API (read-only)
  // =========================================

  // From Stripe (via $enrich)
  mrr: {
    $sync: '$stripe.mrr',
    refresh: '1h',
    readonly: true,
  },

  arr: {
    $sync: '$stripe.mrr * 12',
    refresh: '1h',
    readonly: true,
  },

  // From GitHub
  githubStars: {
    $sync: '$github.stars',
    refresh: '6h',
    readonly: true,
  },

  // =========================================
  // $aggregate - From related entities (read-only)
  // =========================================

  totalCustomers: {
    $aggregate: 'count(customers)',
    readonly: true,
  },

  totalRevenue: {
    $aggregate: 'sum(subscriptions.price)',
    readonly: true,
  },

  averageNps: {
    $aggregate: 'avg(feedback.npsScore)',
    readonly: true,
  },

  // =========================================
  // Relationships (cascades)
  // =========================================

  // $input relationship (user links)
  founders: ['->Founder'],

  // $generate relationship (AI creates)
  icps: ['Who has {problem}? ->IdealCustomerProfile'],

  // $sync relationship (from external)
  stripeAccount: {
    $sync: '->StripeCustomer',
    key: 'stripeId',
  },
})

// =============================================================================
// EXAMPLE: External/Immutable Entity
// =============================================================================

/**
 * GitHubRepoMetrics - All fields are $sync (immutable)
 *
 * We can AFFECT this by:
 * - Pushing code (increases commits)
 * - Marketing (increases stars)
 * - Fixing bugs (decreases issues)
 *
 * But we can't DIRECTLY SET these values.
 */
export const GitHubRepoMetrics = DO({
  $type: 'GitHubRepoMetrics',
  $version: 1,

  // Identity ($input - we choose which repo to track)
  owner: { $input: 'Repository owner', required: true },
  name: { $input: 'Repository name', required: true },

  // All metrics are $sync (read-only from GitHub)
  stars: { $sync: '$github.stargazers_count', readonly: true },
  forks: { $sync: '$github.forks_count', readonly: true },
  openIssues: { $sync: '$github.open_issues_count', readonly: true },
  watchers: { $sync: '$github.watchers_count', readonly: true },

  // Computed from synced data
  popularity: {
    $compute: 'stars + (forks * 2) + (watchers * 0.5)',
    readonly: true,
  },

  // Actions (these AFFECT the external system)
  $actions: {
    // These don't change our data directly - they trigger external changes
    // that will be reflected on next sync
    star: { effect: 'PUT /user/starred/{owner}/{name}' },
    unstar: { effect: 'DELETE /user/starred/{owner}/{name}' },
    fork: { effect: 'POST /repos/{owner}/{name}/forks' },
    createIssue: {
      effect: 'POST /repos/{owner}/{name}/issues',
      params: { title: 'string', body: 'string' },
    },
  },
})

// =============================================================================
// EXAMPLE: Financial Metrics (Stripe)
// =============================================================================

/**
 * FinancialMetrics - SaaS financial metrics from Stripe
 *
 * All values are $sync or $aggregate - we can't directly edit MRR.
 * We AFFECT these by: acquiring customers, changing prices, reducing churn.
 */
export const FinancialMetrics = DO({
  $type: 'FinancialMetrics',
  $version: 1,

  // Link to business ($input)
  business: { $input: '->Business', required: true },

  // Synced from Stripe
  mrr: { $sync: '$stripe.mrr', readonly: true, unit: 'cents' },
  arr: { $compute: 'mrr * 12', readonly: true, unit: 'cents' },

  // Aggregated from subscriptions
  activeSubscriptions: { $aggregate: 'count(subscriptions[status=active])', readonly: true },
  totalCustomers: { $aggregate: 'count(customers)', readonly: true },

  // Churn metrics (computed from historical data)
  churnRate: { $aggregate: 'churned_mrr / starting_mrr', readonly: true, period: 'month' },
  nrr: { $aggregate: '(starting_mrr + expansion - contraction - churn) / starting_mrr', readonly: true },

  // Computed metrics
  arpu: { $compute: 'mrr / activeSubscriptions', readonly: true },
  ltv: { $compute: 'arpu / churnRate', readonly: true },

  // Historical (time-series, all readonly)
  mrrHistory: { $sync: '$stripe.mrr_history', readonly: true, type: 'timeseries' },
})

// =============================================================================
// EXAMPLE: Ad Campaign Metrics (Google Ads)
// =============================================================================

/**
 * AdCampaignMetrics - Performance metrics from Google Ads
 *
 * We can AFFECT by: changing budget, pausing, adjusting targeting
 * But metrics themselves are read-only observations.
 */
export const AdCampaignMetrics = DO({
  $type: 'AdCampaignMetrics',
  $version: 1,

  // Identity
  campaignId: { $input: 'Google Ads campaign ID', required: true },

  // Editable settings (these ARE directly changeable)
  budget: { $input: 'Daily budget (number)', unit: 'cents' },
  status: { $input: 'ENABLED | PAUSED | REMOVED' },

  // Read-only metrics (synced from Google Ads)
  impressions: { $sync: '$gads.impressions', readonly: true },
  clicks: { $sync: '$gads.clicks', readonly: true },
  conversions: { $sync: '$gads.conversions', readonly: true },
  cost: { $sync: '$gads.cost_micros', readonly: true, unit: 'micros' },

  // Computed from synced metrics
  ctr: { $compute: 'clicks / impressions', readonly: true },
  cpc: { $compute: 'cost / clicks', readonly: true },
  cpa: { $compute: 'cost / conversions', readonly: true },
  conversionRate: { $compute: 'conversions / clicks', readonly: true },

  // Actions (affect external system)
  $actions: {
    pause: { effect: 'mutate campaign.status = PAUSED' },
    enable: { effect: 'mutate campaign.status = ENABLED' },
    adjustBudget: {
      effect: 'mutate campaign.budget',
      params: { amount: 'number' },
    },
  },
})

// =============================================================================
// FIELD TYPE INFERENCE RULES
// =============================================================================

/**
 * How field types are inferred (implicit):
 *
 * 1. Plain string description → $input
 *    name: 'Company name'
 *
 * 2. String with {variables} → $generate
 *    pitch: 'Generate pitch for {name}'
 *
 * 3. Function → $compute
 *    full: (x) => x.first + x.last
 *
 * 4. String starting with '$resource.' → $sync (from $enrich)
 *    stars: '$resource.stars'
 *
 * 5. Object with explicit $input/$generate/$compute/$sync/$aggregate
 *    name: { $input: 'Company name', required: true }
 *
 * 6. Cascade without prompt → $input relationship
 *    founder: '->Founder'
 *
 * 7. Cascade with prompt → $generate relationship
 *    icps: ['Who has this problem? ->ICP']
 */

export const FieldTypeRules = {
  // Detection patterns
  isInput: (v: unknown) => typeof v === 'string' && !v.includes('{') && !v.startsWith('$'),
  isGenerate: (v: unknown) => typeof v === 'string' && v.includes('{') && v.includes('}'),
  isCompute: (v: unknown) => typeof v === 'function',
  isSync: (v: unknown) => typeof v === 'string' && v.startsWith('$resource.'),
  isExplicit: (v: unknown) => typeof v === 'object' && v !== null && ('$input' in v || '$generate' in v || '$compute' in v || '$sync' in v || '$aggregate' in v),
}
