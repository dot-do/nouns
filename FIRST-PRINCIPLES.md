# Autonomous Business-as-Code: First Principles

## What is a Business?

At its core, a business is a system that:
1. **Creates value** (products/services)
2. **Delivers value** to customers
3. **Captures value** (revenue)
4. **Operates** (does work to make 1-3 happen)

## The Traditional Stack

```
Human Decision Makers
        ↓
Human Workers → do work → Output
        ↓
Software Tools (assist humans)
        ↓
External Services (Stripe, AWS, etc.)
```

## The Autonomous Stack

```
Business Definition (Code)
        ↓
AI Agents → do work → Output
        ↓
Software Runtime (executes business logic)
        ↓
External Services (source of truth)
```

## What Must Be Defined?

### 1. WHAT (The Nouns)
- What the business IS (identity, structure)
- What it SELLS (products, services)
- WHO it serves (customers, markets)
- What it OWNS (assets, IP, data)
- What it OWES (costs, obligations)

### 2. HOW (The Verbs)
- How it CREATES value (production)
- How it DELIVERS value (fulfillment)
- How it CAPTURES value (sales, billing)
- How it MARKETS (acquisition)
- How it OPERATES (day-to-day)

### 3. WHY (The Strategy)
- Why customers choose it (positioning)
- Why it wins (differentiation)
- Why it exists (mission, vision)

### 4. WHEN (The Triggers)
- When to act (events, schedules)
- When to decide (conditions)
- When to escalate (thresholds)

### 5. WHERE (The Sources)
- Where data comes from (external APIs)
- Where money flows (payment systems)
- Where work happens (execution environment)

---

## First Principle: Everything is Data

In an autonomous business, there is no distinction between:
- Configuration and data
- Code and content
- Schema and instance

Everything is **structured data** that can be:
- Stored (persisted)
- Transmitted (API, events)
- Executed (interpreted as behavior)
- Generated (AI creates)

---

## First Principle: Source of Truth

Every piece of data has exactly ONE source of truth:

| Source | Truth Holder | Our Role |
|--------|--------------|----------|
| **Internal** | Our system | We define & control |
| **External** | Other system | We observe & sync |
| **Generated** | AI | We prompt & accept/reject |
| **Computed** | Derivation | We define formula |
| **Aggregated** | Collection | We define scope |

**Key insight**: We can AFFECT external systems through ACTIONS, but we don't directly SET their data.

---

## First Principle: Layered Abstraction

```
┌─────────────────────────────────────────────────┐
│ BUSINESS LAYER (Strategy, Goals, Metrics)       │
├─────────────────────────────────────────────────┤
│ DOMAIN LAYER (Customers, Products, Orders)      │
├─────────────────────────────────────────────────┤
│ INTEGRATION LAYER (Stripe, GitHub, Ads)         │
├─────────────────────────────────────────────────┤
│ INFRASTRUCTURE LAYER (Compute, Storage, Network)│
└─────────────────────────────────────────────────┘
```

Each layer has its own nouns that reference the layer below.

---

## The Minimal Autonomous Business

What's the smallest thing that can be called a business?

```
1. An OFFER (what you're selling)
2. A CUSTOMER (who's buying)
3. A TRANSACTION (exchange of value)
```

Everything else enables, optimizes, or scales these three.

---

## Building Up: The SaaS Business

A SaaS business adds:

```
OFFER
  └─ Product (the software)
      └─ Features
      └─ Pricing (plans, tiers)

CUSTOMER
  └─ Lead (potential)
  └─ Trial (trying)
  └─ Subscriber (paying)
  └─ Churned (left)

TRANSACTION
  └─ Subscription (recurring)
  └─ Invoice (bill)
  └─ Payment (money movement)

OPERATIONS
  └─ Support (help customers)
  └─ Development (improve product)
  └─ Marketing (acquire customers)

METRICS
  └─ MRR, ARR (revenue)
  └─ Churn, NRR (retention)
  └─ CAC, LTV (unit economics)
```

---

## The Namespace Pattern

External systems have their own data models. We need to:
1. Reference their data (sync)
2. Not conflict with our domain names
3. Map their concepts to ours

**Pattern**: `Source.Type`

```
Stripe.Customer    →  maps to  →  Customer (our domain)
Stripe.Subscription →  maps to  →  Subscription (our domain)
GitHub.Repo        →  observed by →  Product (our domain)
Google.Campaign    →  observed by →  Marketing (our domain)
```

Our domain nouns are the "truth" of our business.
External nouns are observations of external systems.

---

## Data Flow Patterns

### Pattern 1: Internal → Internal
```
Customer (input) → Order (input) → Invoice (computed)
```

### Pattern 2: External → Internal (Sync)
```
Stripe.Payment (external) → sync → Revenue (internal metric)
```

### Pattern 3: Internal → External (Action)
```
Order (internal) → action: charge → Stripe.Payment (external)
```

### Pattern 4: Generated → Internal
```
ICP prompt → generate → IdealCustomerProfile (internal)
```

### Pattern 5: Internal → Generated
```
Customer data → generate → PersonalizedEmail (generated)
```

---

## The Core Types

### Value Types (primitives)
- Text, Number, Boolean, Date
- Enum (constrained text)
- Money (number + currency)
- URL, Email, Phone (validated text)

### Entity Types (nouns)
- Have identity ($id)
- Have schema (fields)
- Have relationships (cascades)
- Have behavior (functions, events)

### Collection Types
- Array of values
- Array of entities
- Aggregations

### Reference Types
- Link to entity (->)
- Fuzzy match (<~)
- External reference (Source.Type)

---

## The Field Sources (Revised)

| Marker | Meaning | Readonly? | Example |
|--------|---------|-----------|---------|
| (none) | User input | No | `name: 'Company name'` |
| `{var}` | AI generates | No* | `pitch: 'Generate for {name}'` |
| `=>` | Computed | Yes | `full: => first + last` |
| `@Source` | Synced from external | Yes | `stars: @Github.stars` |
| `#scope` | Aggregated | Yes | `total: #sum(orders.amount)` |

*Generated fields can be edited (human override of AI)

---

## Syntax Exploration

### Option A: Prefix markers
```typescript
{
  name: 'Company name',           // input
  pitch: '{name} elevator pitch', // generate
  full: '=> first + " " + last',  // compute
  stars: '@Github.Repo.stars',    // sync
  revenue: '#sum(payments.amount)', // aggregate
}
```

### Option B: Suffix markers
```typescript
{
  name: 'Company name',
  pitch: 'Elevator pitch for {name}',
  full: 'first + " " + last =',
  stars: 'Github.Repo.stars @',
  revenue: 'sum(payments.amount) #',
}
```

### Option C: Type prefixes
```typescript
{
  name: $input('Company name'),
  pitch: $generate('Elevator pitch for {name}'),
  full: $compute('first + " " + last'),
  stars: $sync('Github.Repo.stars'),
  revenue: $aggregate('sum(payments.amount)'),
}
```

### Option D: Inference + explicit override
```typescript
{
  // Inferred from syntax
  name: 'Company name',              // no special chars = input
  pitch: 'Pitch for {name}',         // has {var} = generate
  full: (x) => x.first + x.last,     // function = compute

  // Explicit when needed
  stars: { $sync: 'Github.Repo.stars' },
  revenue: { $agg: 'sum(payments.amount)' },
}
```

---

## Next: Define Real Entities

Let's define actual business entities and see where the syntax breaks down:

1. **Stripe.Customer** - external, synced
2. **Customer** - internal, maps to Stripe.Customer
3. **Subscription** - internal + external
4. **Product** - internal, maybe linked to GitHub.Repo
5. **Revenue** - aggregated from payments
6. **ICP** - generated from problem
7. **LandingPage** - generated, deployed somewhere
8. **Ad** - generated, synced with Google.Campaign

This will reveal the real edge cases.
