# Syntax Scratchpad - Working Through Real Entities

## Guiding Questions

For each entity:
1. What fields are INPUT (human provides)?
2. What fields are GENERATED (AI creates)?
3. What fields are SYNCED (from external)?
4. What fields are COMPUTED (derived)?
5. What fields are AGGREGATED (from relationships)?
6. What ACTIONS can affect external systems?
7. What EVENTS should trigger behavior?

---

## Entity 1: Stripe.Customer

This is an EXTERNAL entity - we observe it, don't own it.

```typescript
Stripe.Customer = {
  // Identity (from Stripe)
  id: 'cus_xxx',                    // Stripe assigns

  // Fields (all synced from Stripe API)
  email: @stripe.email,
  name: @stripe.name,
  phone: @stripe.phone,
  currency: @stripe.currency,
  balance: @stripe.balance,         // cents
  created: @stripe.created,         // timestamp
  delinquent: @stripe.delinquent,   // boolean
  metadata: @stripe.metadata,       // object

  // These are Stripe's data - we just observe
}
```

**Observation**: All fields come from Stripe. We need to express "this whole entity is external".

**Syntax idea**:
```typescript
Stripe.Customer = @Stripe('/customers/{id}') {
  // Fields are auto-mapped from API response
  // Or explicit mapping:
  email,
  name,
  balance: $.balance,  // JSONPath if different
}
```

---

## Entity 2: Customer (Our Domain)

This is OUR entity - we own it, but it links to Stripe.

```typescript
Customer = {
  // Our identity
  id: 'generated-uuid',

  // Input fields (we collect)
  email: 'Customer email',          // input, required
  name: 'Customer name',            // input
  company: 'Company name',          // input

  // Link to external (Stripe)
  stripe: -> Stripe.Customer,       // reference, may be null

  // Computed from Stripe (when linked)
  balance: => stripe?.balance ?? 0,
  isDelinquent: => stripe?.delinquent ?? false,

  // Aggregated from relationships
  totalSpend: #sum(orders.total),
  orderCount: #count(orders),

  // Generated (AI enrichment)
  segment: '{company} customer segment analysis',

  // Relationships
  orders: <- Order.customer,
  subscriptions: <- Subscription.customer,
}
```

**Observations**:
1. Mix of input, computed, aggregated, generated
2. Links to external entity (Stripe.Customer)
3. Computed fields depend on external data
4. Aggregates from related entities

---

## Entity 3: Subscription

Exists in BOTH systems - we have our version, Stripe has theirs.

```typescript
Subscription = {
  // Our identity
  id: 'generated-uuid',

  // Link to Stripe (source of truth for billing)
  stripe: -> Stripe.Subscription,

  // Synced from Stripe (readonly, from stripe link)
  status: => stripe.status,           // active|past_due|canceled|...
  currentPeriodStart: => stripe.current_period_start,
  currentPeriodEnd: => stripe.current_period_end,
  cancelAtPeriodEnd: => stripe.cancel_at_period_end,

  // Our input (what plan they're on in our system)
  plan: -> Plan,

  // Computed
  isActive: => status == 'active',
  daysRemaining: => daysBetween(now, currentPeriodEnd),

  // Relationships
  customer: -> Customer,
  invoices: <- Invoice.subscription,

  // Actions (affect Stripe)
  $actions: {
    cancel: -> Stripe.DELETE('/subscriptions/{stripe.id}'),
    pause: -> Stripe.POST('/subscriptions/{stripe.id}/pause'),
    resume: -> Stripe.POST('/subscriptions/{stripe.id}/resume'),
    changePlan: (newPlan) -> Stripe.POST('/subscriptions/{stripe.id}', { price: newPlan.stripePriceId }),
  }
}
```

**Observations**:
1. We have an entity that WRAPS an external entity
2. Some fields are "passthrough" from external
3. Some fields are our own
4. Actions affect the external system

**Syntax challenge**: How to express "this field comes from linked external entity"?

Options:
- `status: => stripe.status` (compute from relationship)
- `status: @stripe.status` (sync marker)
- `status: stripe->status` (path through relationship)

---

## Entity 4: Product

Internal, but may be linked to GitHub for code metrics.

```typescript
Product = {
  // Identity
  id: 'generated-uuid',

  // Input (we define)
  name: 'Product name',
  description: 'Product description',
  type: 'SaaS | API | Mobile | Desktop',

  // Link to code (optional)
  repo: -> Github.Repo?,

  // Synced from GitHub (when repo linked)
  stars: => repo?.stars ?? 0,
  forks: => repo?.forks ?? 0,
  lastCommit: => repo?.pushed_at,

  // Input (pricing)
  plans: [-> Plan],

  // Aggregated
  activeSubscriptions: #count(subscriptions[status='active']),
  mrr: #sum(subscriptions[status='active'].plan.price),

  // Generated
  tagline: 'One-line tagline for {name}: {description}',

  // Relationships
  subscriptions: <- Subscription.plan.product,
}
```

---

## Entity 5: Github.Repo (External)

Pure external observation.

```typescript
Github.Repo = @Github('/repos/{owner}/{name}') {
  // Identity (input - which repo to track)
  owner: 'input:Repository owner',
  name: 'input:Repository name',

  // Synced fields (all readonly)
  description,
  stars: $.stargazers_count,
  forks: $.forks_count,
  openIssues: $.open_issues_count,
  language,
  topics,
  license: $.license.spdx_id,
  defaultBranch: $.default_branch,
  createdAt: $.created_at,
  updatedAt: $.updated_at,
  pushedAt: $.pushed_at,

  // Actions
  $actions: {
    star: -> Github.PUT('/user/starred/{owner}/{name}'),
    unstar: -> Github.DELETE('/user/starred/{owner}/{name}'),
    fork: -> Github.POST('/repos/{owner}/{name}/forks'),
  }
}
```

**Observation**: The `owner` and `name` are INPUT (we choose what to track), but everything else is SYNCED.

---

## Entity 6: ICP (Generated)

Primarily AI-generated, grounded against reference data.

```typescript
IdealCustomerProfile = {
  // Grounding (fuzzy match to reference data)
  occupation: <~ Occupation,        // O*NET
  industry: <~ Industry,            // NAICS

  // Generated (AI creates from context)
  as: 'What role? {occupation}',
  at: 'What company type? {industry}',
  doing: 'What activity?',
  using: 'What tools?',
  toAchieve: 'What goal?',

  // Generated analysis
  painPoints: ['Top pain points for {as} at {at}'],
  motivations: ['Key motivations'],
  objections: ['Common objections'],

  // Computed
  sentence: => `${as} at ${at} are ${doing} using ${using} to ${toAchieve}`,

  // Relationships
  problem: <- Problem.icps,         // What problem they have
  market: 'Size the market -> Market', // Generates Market
}
```

---

## Entity 7: LandingPage (Generated + Deployed)

Generated by AI, but then exists somewhere external (Vercel, etc.)

```typescript
LandingPage = {
  // Identity
  id: 'generated-uuid',
  slug: 'URL slug',                 // input

  // Generated content
  hero: {
    headline: 'Headline for {offer.headline}',
    subheadline: 'Subhead for {offer.subheadline}',
    cta: 'CTA text for {offer.ctaText}',
  },
  sections: ['Generate sections for {offer}'],

  // Deployment state (synced from hosting)
  deployment: -> Vercel.Deployment?,
  url: => deployment?.url,
  status: => deployment?.status ?? 'draft',

  // Metrics (synced from analytics)
  analytics: -> Analytics.Page?,
  visitors: => analytics?.visitors ?? 0,
  conversions: => analytics?.conversions ?? 0,
  conversionRate: => visitors > 0 ? conversions / visitors : 0,

  // Relationships
  offer: -> Offer,
  experiment: -> Experiment,

  // Actions
  $actions: {
    deploy: -> Vercel.POST('/deployments', { content: this.render() }),
    unpublish: -> Vercel.DELETE('/deployments/{deployment.id}'),
  }
}
```

**Observation**: Entity starts as generated content, becomes deployed (external), then has metrics (also external).

---

## Entity 8: Google.Campaign (External + Controllable)

External, but we can modify settings.

```typescript
Google.Campaign = @GoogleAds('/customers/{customerId}/campaigns/{id}') {
  // Identity
  customerId: 'input:Google Ads customer ID',
  id: 'input:Campaign ID',

  // Controllable settings (we can change these)
  name: 'editable:Campaign name',
  status: 'editable:ENABLED | PAUSED | REMOVED',
  budget: 'editable:Daily budget',

  // Metrics (readonly, from Google)
  impressions,
  clicks,
  conversions,
  cost: $.cost_micros,

  // Computed
  ctr: => clicks / impressions,
  cpc: => cost / clicks,
  cpa: => cost / conversions,

  // Actions
  $actions: {
    pause: { status: 'PAUSED' },
    enable: { status: 'ENABLED' },
    setBudget: (amount) => { budget: amount },
  }
}
```

**Key insight**: Some external fields are "editable" - we can push changes back. This is different from pure readonly sync.

---

## Emerging Syntax Patterns

### 1. External Entity Definition
```typescript
Source.Type = @Source('/path/{params}') {
  // input params (we provide)
  param: 'input:description',

  // synced fields (from API)
  field: $.json.path,  // or just fieldName if matches

  // editable fields (can push back)
  setting: 'editable:description',

  // actions
  $actions: { ... }
}
```

### 2. Internal Entity with External Link
```typescript
Type = {
  // our fields
  field: 'description',

  // link to external
  external: -> Source.Type,

  // passthrough from external
  value: => external.field,
}
```

### 3. Field Source Markers
```
(none)     = input (user provides, editable)
{var}      = generate (AI creates, editable)
=>         = compute (derived, readonly)
@          = sync (external, readonly)
#          = aggregate (collection, readonly)
editable:  = sync but pushable
```

### 4. Relationship Markers
```
->         = link to (outgoing)
<-         = link from (incoming)
<~         = fuzzy match (grounding)
~>         = fuzzy search (finding)
```

---

## Unresolved Questions

1. **Namespace syntax**: `Github.Repo` vs `Github_Repo` vs `GithubRepo`?

2. **Mixed source fields**: What if a field can be input OR synced?
   ```
   email: 'input OR @stripe.email'  // Use Stripe if linked, else input
   ```

3. **Conditional fields**: Fields that only exist based on state?
   ```
   canceledAt: @stripe.canceled_at if status == 'canceled'
   ```

4. **Versioning**: How to handle schema changes in external APIs?

5. **Refresh timing**: When does @sync actually refresh?
   ```
   stars: @Github.Repo.stars [refresh: 1h]
   ```

6. **Error handling**: What if external source fails?
   ```
   stars: @Github.Repo.stars ?? 0  // Default on error
   ```
