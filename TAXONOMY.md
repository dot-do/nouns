# DO Field & Entity Taxonomy

## Field Sources

Every field has a **source** (where data comes from):

| Source | Description | Mutability | Example |
|--------|-------------|------------|---------|
| `$input` | User provides | Editable | Founder name, budget |
| `$generate` | AI creates | Regenerable | Pitch, ICP, ad copy |
| `$compute` | Derived from other fields | Auto-updates | `fullName`, runway |
| `$sync` | From external API | Read-only | GitHub stars, MRR |
| `$aggregate` | From related entities | Read-only | Total revenue, count |

## Implicit Inference

Most fields are inferred from syntax:

```typescript
// $input (plain description)
name: 'Company name'

// $generate (has {variables})
pitch: 'Generate pitch for {name}'

// $compute (function)
displayName: (s) => `${s.name} (${s.stage})`

// $sync (from $enrich resource)
stars: '$resource.stars'

// $aggregate (explicit only)
totalRevenue: { $aggregate: 'sum(subscriptions.price)' }
```

## Explicit Syntax

When you need more control:

```typescript
name: {
  $input: 'Company name',
  required: true,
  minLength: 3,
}

pitch: {
  $generate: 'Generate pitch for {name}',
  model: 'opus',
}

mrr: {
  $sync: '$stripe.mrr',
  refresh: '1h',
  readonly: true,
}

arr: {
  $compute: 'mrr * 12',
  unit: 'cents',
}

totalCustomers: {
  $aggregate: 'count(customers)',
  readonly: true,
}
```

## Entity Categories

### 1. User-Defined Entities (mostly $input)

Humans create and edit these. AI may assist but humans control.

```typescript
const Founder = DO({
  $type: 'Founder',

  // All $input - user provides
  name: 'Full name',
  email: 'Email address',
  title: 'CEO | CTO | COO | Other',
  linkedIn: 'LinkedIn URL',

  // Relationship ($input - user links)
  startup: '->Startup',
  person: '->Person',
})
```

**Examples**: Person, Business, Founder, Product (initial setup)

### 2. Generated Entities (mostly $generate)

AI creates these from prompts. Humans can edit/regenerate.

```typescript
const IdealCustomerProfile = DO({
  $type: 'IdealCustomerProfile',

  // Grounding ($input or $sync)
  occupation: '<~Occupation',  // Fuzzy match to reference
  industry: '<~Industry',

  // Generated from context
  as: 'What role do they have?',           // $generate (needs context)
  at: 'What type of company?',             // $generate
  wants: 'What do {as} at {at} want?',     // $generate
  needs: 'What do {as} at {at} need?',     // $generate
  painPoints: 'Pain points for {as}',      // $generate

  // Computed from generated
  sentence: (icp) => `${icp.as} at ${icp.at}...`,  // $compute
})
```

**Examples**: ICP, Market, Solution, Positioning, Hypothesis, Offer, LandingPage, Ad

### 3. External/Synced Entities (mostly $sync)

Data comes from external APIs. We observe, not edit directly.

```typescript
const GitHubRepo = DO({
  $type: 'GitHubRepo',

  // Identity ($input - we choose what to track)
  owner: { $input: 'Repo owner', required: true },
  name: { $input: 'Repo name', required: true },

  // Enrichment source
  $enrich: { resource: '->GitHubRepoResource', params: { owner: '{owner}', repo: '{name}' } },

  // All synced (read-only)
  description: { $sync: '$resource.description', readonly: true },
  stars: { $sync: '$resource.stars', readonly: true },
  forks: { $sync: '$resource.forks', readonly: true },
  language: { $sync: '$resource.language', readonly: true },

  // Computed from synced
  popularity: { $compute: 'stars + forks * 2', readonly: true },

  // Actions (affect external system, not our data)
  $actions: {
    star: { effect: 'PUT /user/starred/{owner}/{name}' },
    fork: { effect: 'POST /repos/{owner}/{name}/forks' },
  },
})
```

**Examples**: GitHubRepo, StripeCustomer, Domain, IPAddress, NPMPackage

### 4. Measured Entities (mostly $sync + $aggregate)

Real-world measurements from analytics, payments, etc.

```typescript
const ExperimentResults = DO({
  $type: 'ExperimentResults',

  // Link to experiment ($input)
  experiment: '->Experiment',

  // Aggregated from visitors/conversions
  visitors: { $aggregate: 'count(visitors)', readonly: true },
  conversions: { $aggregate: 'count(conversions)', readonly: true },

  // Computed metrics
  conversionRate: { $compute: 'conversions / visitors', readonly: true },

  // Statistical (computed)
  confidence: { $compute: 'statistical_significance(conversions, visitors)', readonly: true },
})
```

**Examples**: ExperimentResults, FinancialMetrics, AdCampaignMetrics

### 5. Reference Entities ($seed)

Pre-loaded from authoritative sources. Never edited.

```typescript
const Occupation = DO({
  $type: 'Occupation',

  // Seed source
  $seed: 'https://onetcenter.org/taxonomy/occupations.tsv',
  $id: '$.onet_soc_code',

  // All readonly (from seed)
  onetCode: { $seed: '$.onet_soc_code', readonly: true },
  title: { $seed: '$.title', readonly: true },
  description: { $seed: '$.description', readonly: true },
})
```

**Examples**: Occupation (O*NET), Industry (NAICS), Place (Geonames)

## Data Flow Patterns

### Input → Generate → Compute

```
Problem ($input)
    ↓ "Who has this problem?"
ICP ($generate)
    ↓ compute sentence
ICP.sentence ($compute)
```

### Input → Sync → Compute

```
stripeId ($input)
    ↓ fetch from Stripe
mrr ($sync)
    ↓ multiply by 12
arr ($compute)
```

### Input → Aggregate

```
customers[] ($input, linked)
    ↓ count
totalCustomers ($aggregate)
```

### Action → External → Sync

```
$.createAd() ($action)
    ↓ creates in Google Ads
    ↓ wait for data
impressions, clicks ($sync)
    ↓ compute
ctr, cpc ($compute)
```

## Mutability Rules

| Source | Can User Edit? | Can AI Regenerate? | Auto-updates? |
|--------|---------------|-------------------|---------------|
| `$input` | ✅ Yes | ❌ No | ❌ No |
| `$generate` | ✅ Yes (override) | ✅ Yes | ❌ No |
| `$compute` | ❌ No | ❌ No | ✅ Yes |
| `$sync` | ❌ No | ❌ No | ✅ On refresh |
| `$aggregate` | ❌ No | ❌ No | ✅ On change |

## Actions vs Data

**Data** represents current state. **Actions** affect external systems.

```typescript
const Campaign = DO({
  $type: 'Campaign',

  // Data (what we observe)
  status: { $sync: '$gads.status', readonly: true },
  spend: { $sync: '$gads.cost', readonly: true },
  impressions: { $sync: '$gads.impressions', readonly: true },

  // Actions (what we can do)
  $actions: {
    pause: { effect: 'Set campaign status to PAUSED' },
    resume: { effect: 'Set campaign status to ENABLED' },
    adjustBudget: { effect: 'Update daily budget', params: { amount: 'number' } },
  },
})
```

Actions don't change our data directly - they trigger changes in external systems that we then observe via `$sync`.
