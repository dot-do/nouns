# Nouns - Business-as-Code

> Define businesses as code. Run them with AI.

```typescript
import { $, Noun } from 'nouns.do'

const Startup = Noun({
  $type: 'Startup',
  $extends: Business,

  name: 'Company name',
  vertical: 'Industry vertical',

  stripe: $.Stripe.Account,
  mrr: $.sum($.subscriptions.amount),

  pitch: 'Elevator pitch for {name} in {vertical}',
})
```

## The Vision

**Business-as-Code** is the idea that a business can be fully defined as structured data and executable logic, then run autonomously by AI agents.

**AI-delivered Services-as-Software** means services traditionally delivered by humans (consulting, agencies, support) can be defined as Nouns and Verbs, then executed by AI with the same rigor as software.

**Autonomous Startups** are businesses that operate themselves—agents handle tasks, make decisions (within guardrails), and execute workflows while humans provide strategy and oversight.

## Core Concepts

### Everything is a Noun

A **Noun** is a type definition for a business entity. Every Noun has:

| Property | Purpose |
|----------|---------|
| `$id` | URL identity (for instances) |
| `$type` | Semantic type (class name or URL) |
| `$context` | Vocabulary namespace (schema.org.ai) |
| `$extends` | Inheritance (Noun reference or URL) |

### Field Sources

Every field has a **source**—where its data comes from:

| Source | Syntax | Example |
|--------|--------|---------|
| **Input** | Plain string | `name: 'Company name'` |
| **Generate** | String with `{var}` | `pitch: 'Pitch for {name}'` |
| **Compute** | Function | `arr: ($) => $.mrr * 12` |
| **Sync** | `$.Source.Type` | `stripe: $.Stripe.Customer` |
| **Ref** | `$.field.path` | `balance: $.stripe.balance` |
| **Aggregate** | `$.sum/count/avg()` | `mrr: $.sum($.subscriptions.amount)` |
| **Fuzzy** | `$.fuzzy()` | `occupation: $.fuzzy($.Occupation)` |
| **Link** | `$.Type.where()` | `orders: $.Order.where(o => o.customer)` |

### The $ Proxy

The `$` proxy provides type-safe field definitions:

```typescript
// External source (syncs from Stripe API)
stripe: $.Stripe.Customer

// Field reference (passthrough from synced data)
balance: $.stripe.balance

// Aggregation (computed from related entities)
totalSpend: $.sum($.orders.amount)
orderCount: $.count($.orders)

// Relationship (link with filter)
orders: $.Order.where(o => o.customer)

// Fuzzy match (ground against reference data)
occupation: $.fuzzy($.Occupation)
```

### Inheritance

Nouns are callable—call a Noun to extend it:

```typescript
const Thing = Noun({
  $type: 'Thing',
  $context: 'https://schema.org.ai',
  name: 'Name',
  description: 'Description',
})

// Call Thing to extend it
const Organization = Thing({
  $type: 'Organization',
  foundingDate: 'Date founded',
})

// Call Organization to extend it
const Business = Organization({
  $type: 'Business',
  mrr: $.sum($.subscriptions.amount),
})

// Call Business to extend it
const Startup = Business({
  $type: 'Startup',
  vertical: 'Industry vertical',
  pitch: 'Elevator pitch for {name}',
})

// Inheritance chain: Startup → Business → Organization → Thing
// Context is inherited: all have 'https://schema.org.ai'
```

You can also use explicit `$extends` for external schemas:

```typescript
const Startup = Noun({
  $type: 'Startup',
  $extends: 'https://schema.org.ai/Organization',
  // ...
})
```

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│ AUTONOMOUS LAYER (Agents, Tasks, Decisions)         │
├─────────────────────────────────────────────────────┤
│ BUSINESS LAYER (Business, Startup, Metrics)         │
├─────────────────────────────────────────────────────┤
│ DOMAIN LAYER (Customers, Products, Subscriptions)   │
├─────────────────────────────────────────────────────┤
│ INTEGRATION LAYER (Stripe, GitHub, Google)          │
├─────────────────────────────────────────────────────┤
│ INFRASTRUCTURE (Compute, Storage, Network)          │
└─────────────────────────────────────────────────────┘
```

## Core Nouns

### Business Layer

```typescript
// A business that creates, delivers, and captures value
const Business = Organization({
  $type: 'Business',

  domain: 'Primary domain',
  stage: 'Idea | Validation | Growth | Scale | Mature',

  stripe: $.Stripe.Account,
  products: $.Product.where(p => p.business),
  customers: $.Customer.where(c => c.business),

  mrr: $.sum($.subscriptions.amount),
  arr: ($) => $.mrr * 12,
  customerCount: $.count($.customers),
})

// An early-stage business designed for rapid growth
const Startup = Business({
  $type: 'Startup',

  vertical: 'Industry vertical',
  runway: 'Months of runway',
  raised: 'Total funding raised',

  burnRate: ($) => $.raised / $.runway,
  pitch: 'Elevator pitch for {name} solving {problem}',
})
```

### Customer Layer

```typescript
// Someone who pays for value
const Customer = Person({
  $type: 'Customer',

  company: 'Company name',
  segment: 'Enterprise | SMB | Startup | Consumer',

  stripe: $.Stripe.Customer,
  balance: $.stripe.balance,
  delinquent: $.stripe.delinquent,

  subscriptions: $.Subscription.where(s => s.customer),
  totalSpend: $.sum($.payments.amount),
  lifetimeValue: $.sum($.invoices.total),

  healthScore: 'Calculate health for {name} based on {totalSpend}, {delinquent}',
})

// AI-generated customer archetype
const IdealCustomerProfile = Noun({
  $type: 'IdealCustomerProfile',

  occupation: $.fuzzy($.Occupation),  // Ground to O*NET
  industry: $.fuzzy($.Industry),      // Ground to NAICS

  as: 'Role grounded to {occupation}',
  at: 'Company type grounded to {industry}',
  painPoints: 'Pain points for {as} at {at}',

  sentence: ($) => `${$.as} at ${$.at}`,
})
```

### Product Layer

```typescript
// Something a business sells
const Product = Thing({
  $type: 'Product',

  type: 'SaaS | API | Mobile | Desktop | Service',

  repo: $.Github.Repo,
  stars: $.repo.stargazers_count,

  plans: $.Plan.where(p => p.product),
  subscriptions: $.Subscription.where(s => s.product),

  mrr: $.sum($.subscriptions.amount),
  arr: ($) => $.mrr * 12,
})

// Ongoing customer relationship
const Subscription = Noun({
  $type: 'Subscription',

  customer: $.Customer,
  product: $.Product,
  plan: $.Plan,

  stripe: $.Stripe.Subscription,
  status: $.stripe.status,
  currentPeriodEnd: $.stripe.current_period_end,

  isActive: ($) => $.status === 'active',
  amount: ($) => $.plan.price,

  $cancel: '=> stripe.$cancel()',
  $changePlan: '(plan) => stripe.$update({ price: plan.stripePrice.id })',
})
```

### Autonomous Layer

```typescript
// An AI that performs work
const Agent = Noun({
  $type: 'Agent',

  name: 'Agent name',
  role: 'Agent role',
  model: 'claude-3-5-sonnet | claude-3-opus',
  systemPrompt: 'System prompt',
  autonomyLevel: 'full | supervised | approval-required',

  tasks: $.Task.where(t => t.agent),
  decisions: $.Decision.where(d => d.agent),

  capabilities: 'List capabilities for {role}',
})

// A choice that may need approval
const Decision = Noun({
  $type: 'Decision',

  title: 'Decision title',
  options: 'Available options',
  recommendation: 'Recommended option',
  reasoning: 'Why this recommendation',

  status: 'pending | approved | rejected | auto-approved',
  impactLevel: 'low | medium | high | critical',

  requiresApproval: ($) => $.impactLevel === 'high' || $.impactLevel === 'critical',
})
```

## External Sources

Sources are external APIs we sync from:

```typescript
// Stripe payment infrastructure
const StripeCustomer = Noun({
  $type: 'Stripe.Customer',

  id: 'Stripe customer ID',

  $resource: Stripe.Resource({
    path: '/customers/{id}',
  }),

  email: 'Customer email',
  balance: 'Account balance',
  delinquent: 'Is delinquent',

  $update: 'POST /customers/{id}',
  $delete: 'DELETE /customers/{id}',
})

// GitHub code infrastructure
const GithubRepo = Noun({
  $type: 'Github.Repo',

  owner: 'Repo owner',
  name: 'Repo name',

  $resource: Github.Resource({
    path: '/repos/{owner}/{name}',
  }),

  stargazers_count: 'Star count',
  forks_count: 'Fork count',

  $star: 'PUT /user/starred/{owner}/{name}',
  $fork: 'POST /repos/{owner}/{name}/forks',
})
```

## Types vs Instances

Use `new` to create instances. Call without `new` to extend types:

```typescript
// TYPE - extend with no `new` (has $type)
const HeadlessSaaS = Product({
  $type: 'HeadlessSaaS',
  apiFirst: true,
  consumers: 'AI agents, not humans',
})

// INSTANCE - create with `new` (has $id)
const crmHeadlessly = new HeadlessSaaS({
  $id: 'https://crm.headless.ly',
  name: 'Headless CRM',
  description: 'CRM for AI agents',
})

// Another instance
const acme = new Tenant({
  $id: 'https://crm.headless.ly/acme',
  name: 'Acme Corp',
  plan: 'Pro',
})
```

Helper functions:

```typescript
import { isType, isInstance, getType, getId } from 'nouns.do'

isType(HeadlessSaaS)      // true - it's a type definition
isInstance(crmHeadlessly) // true - it's an actual thing

getType(HeadlessSaaS)     // 'HeadlessSaaS'
getId(crmHeadlessly)      // 'https://crm.headless.ly'
```

### URL Hierarchy

Instances form a natural URL hierarchy:

```
https://startups.studio              # Startup studio
  └── https://headless.ly            # A startup
        ├── https://crm.headless.ly  # A product
        │     ├── /acme              # A tenant
        │     └── /widgets           # Another tenant
        ├── https://email.headless.ly
        └── https://analytics.headless.ly
```

## Semantic Web Integration

Nouns are compatible with JSON-LD and schema.org:

```typescript
const Startup = Noun({
  $type: 'Startup',
  $context: 'https://schema.org.ai',
  $extends: 'https://schema.org/Organization',

  // Maps to schema.org properties
  name: 'Company name',        // schema:name
  foundingDate: 'Date founded', // schema:foundingDate

  // AI-native extensions
  pitch: 'Elevator pitch for {name}',
})
```

Every instance has a URL identity:

```typescript
const acme = {
  $id: 'https://nouns.do/startups/acme',
  $type: 'Startup',
  name: 'Acme Corp',
  // ...
}
```

## Packages

| Package | Purpose |
|---------|---------|
| `@dotdo/nouns` | Core library (open source) |
| `nouns.do` | Managed PaaS with auth, hosting, AI |

```typescript
// Core library
import { $, Noun } from '@dotdo/nouns'

// Managed service
import { $, Noun } from 'nouns.do'
```

## First Principles

### What is a Business?

1. **Creates value** (products/services)
2. **Delivers value** to customers
3. **Captures value** (revenue)
4. **Operates** (does work to make 1-3 happen)

### Source of Truth

Every piece of data has exactly ONE source of truth:

| Source | Truth Holder | Our Role |
|--------|--------------|----------|
| **Internal** | Our system | Define & control |
| **External** | Other system | Observe & sync |
| **Generated** | AI | Prompt & accept/reject |
| **Computed** | Derivation | Define formula |
| **Aggregated** | Collection | Define scope |

### The Minimal Business

The smallest thing that can be called a business:

```typescript
const MinimalBusiness = {
  offer: Offer,       // What you're selling
  customer: Customer, // Who's buying
  transaction: Payment, // Exchange of value
}
```

Everything else enables, optimizes, or scales these three.

## License

MIT
