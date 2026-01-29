/**
 * Core Business Types
 *
 * Comprehensive type definitions for Business-as-Code
 */

import { $, Noun } from './nouns.js'

const ctx = 'https://schema.org.ai'

// =============================================================================
// BASE TYPES
// =============================================================================

export const Thing = Noun({
  $type: 'Thing',
  $context: ctx,

  name: 'Name',
  description: 'Description',
  url: 'URL',
  image: 'Image URL',
  slug: 'URL-safe identifier',
})

export const Person = Thing({
  $type: 'Person',

  email: 'Email address',
  phone: 'Phone number',
  avatar: 'Avatar URL',

  displayName: ($: any) => $.name || $.email?.split('@')[0] || 'Unknown',
})

export const Organization = Thing({
  $type: 'Organization',

  legalName: 'Legal entity name',
  foundingDate: 'Date founded',
  location: 'Headquarters location',
  domain: 'Primary domain',

  founders: $.Person.where((p: any) => p.organization),
  employees: $.Person.where((p: any) => p.employer),
  teamSize: $.count($.employees),
})

// =============================================================================
// BUSINESS TYPES
// =============================================================================

export const Business = Organization({
  $type: 'Business',

  stage: 'Idea | Validation | Growth | Scale | Mature',
  industry: 'Industry vertical',
  businessModel: 'B2B | B2C | B2B2C | Marketplace | Platform',

  // External integrations
  stripe: $.Stripe.Account,
  github: $.Github.Organization,

  // Revenue
  stripeBalance: $.stripe.balance,
  mrr: $.sum($.subscriptions.amount),
  arr: ($: any) => $.mrr * 12,

  // Relationships
  products: $.Product.where((p: any) => p.business),
  customers: $.Customer.where((c: any) => c.business),
  subscriptions: $.Subscription.where((s: any) => s.business),

  // Aggregated
  customerCount: $.count($.customers),
  productCount: $.count($.products),

  // Generated
  positioning: 'Positioning statement for {name} in {industry}',
  valueProposition: 'Value proposition for {name}',
})

export const Startup = Business({
  $type: 'Startup',

  vertical: 'Specific vertical within industry',
  stage: 'Pre-seed | Seed | Series A | Series B | Series C | Growth | Public',

  // Funding
  raised: 'Total funding raised',
  valuation: 'Current valuation',
  runway: 'Months of runway remaining',

  // Investors
  investors: $.Investor.where((i: any) => i.portfolio),
  leadInvestor: $.Investor,

  // Computed
  burnRate: ($: any) => $.raised && $.runway ? $.raised / $.runway : 0,
  monthsToDefault: ($: any) => $.stripeBalance && $.burnRate ? $.stripeBalance / $.burnRate : null,

  // Generated
  pitch: 'Elevator pitch for {name} in {vertical}',
  whyNow: 'Why now is the right time for {name}',
  competitiveAdvantage: 'Competitive advantage of {name}',
})

export const Studio = Business({
  $type: 'Studio',

  focus: 'Studio focus area',
  model: 'Venture Studio | Agency | Incubator | Accelerator',

  // Portfolio
  portfolio: $.Startup.where((s: any) => s.studio),
  portfolioCount: $.count($.portfolio),

  // Success metrics
  exits: $.Exit.where((e: any) => e.studio),
  totalExitValue: $.sum($.exits.value),

  // Generated
  thesis: 'Investment thesis for {name}',
})

// =============================================================================
// PRODUCT TYPES
// =============================================================================

export const Product = Thing({
  $type: 'Product',

  tagline: 'Short tagline',
  productKind: 'SaaS | API | SDK | App | Service | Platform',
  status: 'Development | Beta | Live | Sunset | Deprecated',

  // Business
  business: $.Business,

  // Code
  repo: $.Github.Repo,
  stars: $.repo.stargazers_count,
  forks: $.repo.forks_count,

  // Pricing
  plans: $.Plan.where((p: any) => p.product),

  // Metrics
  subscriptions: $.Subscription.where((s: any) => s.product),
  activeSubscriptions: $.count($.subscriptions),
  mrr: $.sum($.subscriptions.amount),
  arr: ($: any) => $.mrr * 12,

  // Generated
  positioning: 'Positioning for {name}: {tagline}',
})

export const SaaS = Product({
  $type: 'SaaS',

  productKind: 'SaaS',

  // SaaS-specific
  multiTenant: 'Whether multi-tenant',
  selfServe: 'Whether self-serve signup',
  freeTier: 'Whether has free tier',

  // Tenants
  tenants: $.Tenant.where((t: any) => t.product),
  tenantCount: $.count($.tenants),

  // Metrics
  dau: 'Daily active users',
  mau: 'Monthly active users',
  churnRate: 'Monthly churn rate',
  nrr: 'Net revenue retention',
  ltv: 'Customer lifetime value',
  cac: 'Customer acquisition cost',
  ltvCacRatio: ($: any) => $.ltv && $.cac ? $.ltv / $.cac : null,

  // Generated
  idealCustomer: 'Ideal customer profile for {name}',
})

export const HeadlessSaaSType = SaaS({
  $type: 'HeadlessSaaS',

  // Headless = API-first, no UI, for AI/automation
  hasUI: false,
  apiFirst: true,
  consumers: 'AI agents and automation, not humans',

  // API
  apiBase: 'API base URL',
  apiDocs: 'API documentation URL',
  sdks: $.SDK.where((s: any) => s.product),

  // Generated
  aiUseCases: 'AI use cases for {name}',
})

export const API = Product({
  $type: 'API',

  productKind: 'API',

  // API-specific
  version: 'API version',
  baseUrl: 'Base URL',
  docsUrl: 'Documentation URL',
  openApiSpec: 'OpenAPI spec URL',

  // Auth
  authMethod: 'API Key | OAuth | JWT | Bearer',

  // Rate limits
  rateLimit: 'Requests per minute',
  rateLimitTier: 'Rate limit by plan',

  // Endpoints
  endpoints: $.Endpoint.where((e: any) => e.api),
  endpointCount: $.count($.endpoints),

  // Usage
  totalRequests: $.sum($.usage.requests),
  avgLatency: $.avg($.usage.latency),

  // Generated
  quickstart: 'Quickstart guide for {name} API',
})

export const SDK = Product({
  $type: 'SDK',

  productKind: 'SDK',

  // SDK-specific
  language: 'JavaScript | TypeScript | Python | Go | Rust | Ruby | Java | C#',
  runtime: 'Node | Browser | Deno | Bun | Edge',
  packageName: 'Package name (npm, pip, etc)',
  packageManager: 'npm | pip | cargo | gem | maven | nuget',

  // Versions
  version: 'Current version',
  minVersion: 'Minimum supported version',

  // Stats
  downloads: 'Total downloads',
  weeklyDownloads: 'Weekly downloads',

  // Links
  npm: $.NPM.Package,
  npmDownloads: $.npm.downloads,

  // For API/Product
  api: $.API,
  product: $.Product,

  // Generated
  installGuide: 'Installation guide for {name}',
})

export const App = Product({
  $type: 'App',

  productKind: 'App',

  // App-specific
  platform: 'Web | iOS | Android | Desktop | CLI',
  framework: 'Next.js | React | Vue | Svelte | React Native | Flutter | Electron',

  // Deployment
  deployment: $.Vercel.Deployment,
  deployUrl: $.deployment.url,

  // Analytics
  analytics: $.Analytics.Page,
  visitors: $.analytics.visitors,
  conversions: $.analytics.conversions,

  // Generated
  featureList: 'Key features of {name}',
})

// =============================================================================
// AGENT & SERVICE TYPES
// =============================================================================

export const Agent = Thing({
  $type: 'Agent',

  // Identity
  role: 'Agent role/responsibility',
  capabilities: 'Agent capabilities',

  // Configuration
  model: 'claude-3-5-sonnet | claude-3-opus | gpt-4o | gpt-4-turbo',
  systemPrompt: 'System prompt',
  temperature: 'Temperature (0-1)',
  maxTokens: 'Max tokens per response',

  // Tools
  tools: $.Tool.where((t: any) => t.agent),
  toolCount: $.count($.tools),

  // Autonomy
  autonomyLevel: 'Full | Supervised | Approval-Required | Manual',
  approvalThreshold: 'Impact level requiring approval',

  // Business
  business: $.Business,

  // Metrics
  tasks: $.Task.where((t: any) => t.agent),
  tasksCompleted: $.count($.tasks),
  successRate: $.avg($.tasks.success),

  // Generated
  instructions: 'Detailed instructions for {name} agent with role {role}',
})

export const Service = Thing({
  $type: 'Service',

  // Service definition
  deploymentType: 'Managed | Self-Hosted | Serverless | Edge',
  category: 'Infrastructure | Platform | Application',

  // Business
  business: $.Business,

  // Pricing
  pricingModel: 'Subscription | Usage | Hybrid | Free',
  plans: $.Plan.where((p: any) => p.service),

  // SLA
  uptime: 'Uptime SLA percentage',
  supportLevel: 'Community | Email | Priority | Dedicated',
  responseTime: 'Support response time SLA',

  // Customers
  customers: $.Customer.where((c: any) => c.service),
  customerCount: $.count($.customers),

  // Generated
  serviceBenefits: 'Benefits of {name} service',
})

export const ManagedService = Service({
  $type: 'ManagedService',

  deploymentType: 'Managed',

  // Managed-specific
  infrastructure: 'Cloud provider and setup',
  regions: 'Available regions',
  compliance: 'Compliance certifications',

  // Includes
  includes: 'What is included in the managed service',
  monitoring: 'Monitoring and alerting',
  backups: 'Backup policy',

  // Generated
  comparisonToSelfHosted: 'Comparison of {name} managed vs self-hosted',
})

// =============================================================================
// CUSTOMER TYPES
// =============================================================================

export const Customer = Person({
  $type: 'Customer',

  company: 'Company name',
  title: 'Job title',
  segment: 'Enterprise | SMB | Startup | Consumer',

  // Business relationship
  business: $.Business,

  // Stripe
  stripe: $.Stripe.Customer,
  balance: $.stripe.balance,
  delinquent: $.stripe.delinquent,

  // Relationships
  subscriptions: $.Subscription.where((s: any) => s.customer),
  invoices: $.Invoice.where((i: any) => i.customer),

  // Aggregated
  totalSpend: $.sum($.invoices.total),
  subscriptionCount: $.count($.subscriptions),
  lifetimeValue: $.sum($.invoices.total),

  // Computed
  isHealthy: ($: any) => !$.delinquent && $.balance >= 0,

  // Generated
  healthScore: 'Health score for {name} based on {totalSpend}, {subscriptionCount}',
})

export const Tenant = Customer({
  $type: 'Tenant',

  // Multi-tenancy
  subdomain: 'Tenant subdomain',
  customDomain: 'Custom domain if any',

  // Product
  product: $.SaaS,
  plan: $.Plan,

  // Usage
  usage: 'Current usage metrics',
  usagePercent: ($: any) => $.usage && $.plan?.limits ? $.usage / $.plan.limits * 100 : 0,

  // Data
  dataRegion: 'Data storage region',
  dataRetention: 'Data retention policy',
})

export const Investor = Person({
  $type: 'Investor',

  firm: 'Investment firm',
  investorKind: 'Angel | VC | PE | Corporate | Family Office',
  checkSize: 'Typical check size range',
  stage: 'Stages invested in',
  sectors: 'Sectors of interest',

  // Portfolio
  portfolio: $.Startup.where((s: any) => s.investors),
  portfolioCount: $.count($.portfolio),

  // Metrics
  totalInvested: $.sum($.portfolio.investedAmount),
  exits: $.count($.portfolio.exits),

  // Generated
  investmentThesis: 'Investment thesis for {name} at {firm}',
})

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

export const Plan = Thing({
  $type: 'Plan',

  // Pricing
  price: 'Monthly price in cents',
  interval: 'month | year',
  currency: 'USD | EUR | GBP',

  // Limits
  limits: 'Usage limits',
  features: 'Included features',

  // Product/Service
  product: $.Product,
  service: $.Service,

  // Stripe
  stripePrice: $.Stripe.Price,

  // Subscribers
  subscriptions: $.Subscription.where((s: any) => s.plan),
  subscriberCount: $.count($.subscriptions),
  revenue: ($: any) => $.subscriberCount * $.price,
})

export const Subscription = Thing({
  $type: 'Subscription',

  // Relationships
  customer: $.Customer,
  product: $.Product,
  plan: $.Plan,
  business: $.Business,

  // Stripe
  stripe: $.Stripe.Subscription,
  status: $.stripe.status,
  currentPeriodEnd: $.stripe.current_period_end,
  cancelAtPeriodEnd: $.stripe.cancel_at_period_end,

  // Our data
  startedAt: 'When subscription started',
  trialEndsAt: 'When trial ends',

  // Computed
  isActive: ($: any) => $.status === 'active' || $.status === 'trialing',
  isTrialing: ($: any) => $.status === 'trialing',
  amount: ($: any) => $.plan?.price || 0,
  daysRemaining: ($: any) => $.currentPeriodEnd ? Math.ceil(($.currentPeriodEnd * 1000 - Date.now()) / 86400000) : 0,
})

export const Task = Thing({
  $type: 'Task',

  // Status
  status: 'Pending | In Progress | Completed | Failed | Cancelled',
  priority: 'Low | Medium | High | Urgent',

  // Assignment
  agent: $.Agent,
  assignee: $.Person,

  // Timing
  createdAt: 'Created timestamp',
  startedAt: 'Started timestamp',
  completedAt: 'Completed timestamp',
  dueAt: 'Due timestamp',

  // Result
  result: 'Task result',
  error: 'Error if failed',
  success: ($: any) => $.status === 'Completed',

  // Duration
  duration: ($: any) => $.completedAt && $.startedAt ? $.completedAt - $.startedAt : null,
})

export const Tool = Thing({
  $type: 'Tool',

  // Definition
  function: 'Tool function name',
  parameters: 'Tool parameters schema',

  // Agent
  agent: $.Agent,

  // API
  api: $.API,
  endpoint: 'API endpoint to call',

  // Generated
  documentation: 'Documentation for {name} tool',
})

// =============================================================================
// EXPORT ALL TYPES
// =============================================================================

export const Types = {
  // Base
  Thing,
  Person,
  Organization,

  // Business
  Business,
  Startup,
  Studio,

  // Product
  Product,
  SaaS,
  HeadlessSaaS: HeadlessSaaSType,
  API,
  SDK,
  App,

  // Agent & Service
  Agent,
  Service,
  ManagedService,

  // Customer
  Customer,
  Tenant,
  Investor,

  // Supporting
  Plan,
  Subscription,
  Task,
  Tool,
}
