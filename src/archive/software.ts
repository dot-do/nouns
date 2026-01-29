import { DO } from './do/do'

export const SaaS = DO({
  $type: 'SaaS',
  $version: 1,

  // Identity
  name: 'SaaS product name',
  domain: 'Primary domain',
  tagline: 'Value proposition',
  description: 'What the SaaS does',

  // Classification
  category: 'CRM | ERP | HCM | Marketing | Sales | Support | Analytics | Productivity | DevTools | FinTech | HealthTech | EdTech | Other',
  vertical: 'Horizontal | Vertical',
  targetMarket: 'SMB | MidMarket | Enterprise | Consumer',

  // Deployment
  deployment: 'MultiTenant | SingleTenant | Hybrid | OnPrem',
  regions: ['Available regions'],

  // Technical
  architecture: 'Monolith | Microservices | Serverless | Hybrid',
  stack: ['Technology stack'],
  api: 'Public API ->API',

  // Pricing
  freeTier: 'Has free tier (boolean)',
  trialDays: 'Trial period in days (number)',
  pricing: [{
    name: 'Tier name',
    price: 'Monthly price (number)',
    annualPrice: 'Annual price (number)',
    features: ['Included features'],
    limits: {
      users: 'User limit (number)',
      storage: 'Storage limit GB (number)',
      apiCalls: 'API call limit (number)',
    },
  }],

  // Compliance
  compliance: {
    soc2: 'SOC2 certified (boolean)',
    gdpr: 'GDPR compliant (boolean)',
    hipaa: 'HIPAA compliant (boolean)',
    iso27001: 'ISO 27001 certified (boolean)',
  },

  // Security
  security: {
    sso: 'SSO supported (boolean)',
    mfa: 'MFA supported (boolean)',
    encryption: 'Transit | Rest | E2E',
    audit: 'Audit logging (boolean)',
  },

  // Metrics
  metrics: {
    mrr: 'Monthly recurring revenue (number)',
    arr: 'Annual recurring revenue (number)',
    customers: 'Total customers (number)',
    churn: 'Monthly churn rate (number)',
    nrr: 'Net revenue retention (number)',
    arpu: 'Average revenue per user (number)',
  },

  // Relationships
  owner: 'Owning company ->Business',
  customers: ['<- Subscription.saas'],
  integrations: ['Available integrations ->Integration'],
  competitors: ['Competing products ~>SaaS'],

  // Generated
  comparison: { mdx: 'Compare {name} vs {competitors}' },
  onboarding: { mdx: 'Generate onboarding flow for {name}' },

  // Events
  onSubscriptionCreated: (sub, $) => $.call('provisionTenant', [sub]),
  onTrialExpiring: (tenant, $) => $.call('sendTrialReminder', [tenant]),

  // Schedules
  everyDay: ($) => $.call('checkTrialExpirations', []),
  everyMonth: ($) => $.call('generateMRRReport', []),
})

export const IaaS = DO({
  $type: 'IaaS',
  $version: 1,

  // Identity
  name: 'IaaS provider name',
  description: 'Infrastructure services offered',

  // Services
  compute: [{
    name: 'Compute service name',
    type: 'VM | Container | Serverless | Bare Metal',
    description: 'What it provides',
  }],
  storage: [{
    name: 'Storage service name',
    type: 'Block | Object | File | Archive',
    description: 'Storage capabilities',
  }],
  network: [{
    name: 'Network service name',
    type: 'VPC | LoadBalancer | CDN | DNS | VPN',
    description: 'Network capabilities',
  }],
  database: [{
    name: 'Database service name',
    type: 'Relational | NoSQL | Graph | TimeSeries | Vector',
    description: 'Database capabilities',
  }],

  // Regions
  regions: [{
    name: 'Region name',
    code: 'Region code',
    zones: ['Availability zones'],
    compliance: ['Compliance certifications'],
  }],

  // Pricing
  pricingModel: 'PayAsYouGo | Reserved | Spot | Committed',
  freeCredits: 'Free credits for new accounts (number)',
  calculator: 'Pricing calculator URL',

  // Developer experience
  console: 'Management console URL',
  cli: 'CLI tool name',
  sdks: ['Available SDK languages'],
  terraform: 'Terraform provider (boolean)',
  pulumi: 'Pulumi provider (boolean)',

  // Compliance
  compliance: ['Compliance certifications'],

  // Metrics
  metrics: {
    uptime: 'Platform uptime (number)',
    regions: 'Number of regions (number)',
    services: 'Number of services (number)',
  },

  // Relationships
  provider: 'Provider company ->Business',
  customers: ['<- Deployment.iaas'],
  competitors: ['Competing providers ~>IaaS'],
})

export const PaaS = DO({
  $type: 'PaaS',
  $version: 1,

  // Identity
  name: 'PaaS platform name',
  description: 'What the platform enables',
  tagline: 'Value proposition',

  // Capabilities
  runtimes: ['Supported language runtimes'],
  frameworks: ['Supported frameworks'],
  databases: ['Managed database options'],

  // Features
  features: {
    gitDeploy: 'Git-based deployment (boolean)',
    autoScale: 'Auto-scaling (boolean)',
    preview: 'Preview environments (boolean)',
    rollback: 'Instant rollback (boolean)',
    logs: 'Centralized logging (boolean)',
    metrics: 'Built-in metrics (boolean)',
    secrets: 'Secrets management (boolean)',
  },

  // Deployment
  deployment: {
    regions: ['Available regions'],
    edge: 'Edge deployment (boolean)',
    hybrid: 'Hybrid cloud support (boolean)',
  },

  // Pricing
  pricing: [{
    name: 'Plan name',
    price: 'Monthly price (number)',
    compute: 'Compute included',
    bandwidth: 'Bandwidth included',
    builds: 'Build minutes included (number)',
  }],
  freeHobby: 'Has free/hobby tier (boolean)',

  // Developer experience
  cli: 'CLI tool name',
  dashboard: 'Dashboard URL',
  documentation: 'Documentation URL',

  // Integrations
  integrations: ['Platform integrations'],
  marketplace: 'Has addon marketplace (boolean)',

  // Relationships
  provider: 'Provider company ->Business',
  apps: ['<- Deployment.paas'],
  competitors: ['Competing platforms ~>PaaS'],

  // Generated
  migration: { mdx: 'Generate migration guide from {competitor} to {name}' },
})
