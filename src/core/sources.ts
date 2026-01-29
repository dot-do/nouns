/**
 * External Sources - APIs that provide data
 *
 * Sources are external systems we sync from.
 * Resources are specific API endpoints within a source.
 *
 * Pattern:
 *   Source.Resource -> maps to -> internal Noun field
 *   $.Stripe.Customer -> syncs to -> customer.stripe
 */

import { $, Noun } from './nouns.js'

// =============================================================================
// SOURCE DEFINITION
// =============================================================================

export interface SourceConfig {
  $type: string
  $context?: string
  base: string
  auth: string
  headers?: Record<string, string>
}

export interface ResourceConfig {
  source: string
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  transform?: (data: any) => any
  cache?: string
  refresh?: string
}

export function Source(config: SourceConfig) {
  return {
    ...config,
    Resource: (resourceConfig: Omit<ResourceConfig, 'source'>) => ({
      ...resourceConfig,
      source: config.$type,
    }),
  }
}

// =============================================================================
// STRIPE - Payment Infrastructure
// =============================================================================

export const Stripe = Source({
  $type: 'Stripe',
  base: 'https://api.stripe.com/v1',
  auth: '$env.STRIPE_SECRET_KEY',
  headers: { 'Stripe-Version': '2023-10-16' },
})

export const StripeCustomer = Noun({
  $type: 'Stripe.Customer',
  $context: 'https://schema.org.ai',

  // Identity (we provide to lookup)
  id: 'Stripe customer ID (cus_xxx)',

  // Resource config
  $resource: Stripe.Resource({
    path: '/customers/{id}',
  }),

  // Synced fields (all from Stripe API)
  email: 'Customer email',
  name: 'Customer name',
  phone: 'Customer phone',
  currency: 'Default currency',
  balance: 'Account balance in cents',
  created: 'Unix timestamp of creation',
  delinquent: 'Whether customer is delinquent',
  metadata: 'Custom metadata object',

  // Computed
  balanceDollars: ($: any) => $.balance / 100,
  createdDate: ($: any) => new Date($.created * 1000),

  // Actions
  $update: 'POST /customers/{id}',
  $delete: 'DELETE /customers/{id}',
})

export const StripeSubscription = Noun({
  $type: 'Stripe.Subscription',
  $context: 'https://schema.org.ai',

  // Identity
  id: 'Stripe subscription ID (sub_xxx)',

  // Resource config
  $resource: Stripe.Resource({
    path: '/subscriptions/{id}',
  }),

  // Synced fields
  status: 'Subscription status',
  customer: 'Stripe customer ID',
  current_period_start: 'Current period start (unix)',
  current_period_end: 'Current period end (unix)',
  cancel_at_period_end: 'Whether canceling at period end',
  canceled_at: 'When subscription was canceled',
  ended_at: 'When subscription ended',
  trial_start: 'Trial start (unix)',
  trial_end: 'Trial end (unix)',
  metadata: 'Custom metadata object',

  // Price info (from items)
  priceId: ($: any) => $.items?.data?.[0]?.price?.id,
  amount: ($: any) => $.items?.data?.[0]?.price?.unit_amount,
  interval: ($: any) => $.items?.data?.[0]?.price?.recurring?.interval,

  // Computed
  isActive: ($: any) => $.status === 'active' || $.status === 'trialing',
  isTrialing: ($: any) => $.status === 'trialing',
  daysRemaining: ($: any) => Math.ceil(($.current_period_end * 1000 - Date.now()) / 86400000),

  // Actions
  $cancel: 'DELETE /subscriptions/{id}',
  $pause: 'POST /subscriptions/{id}/pause',
  $resume: 'POST /subscriptions/{id}/resume',
  $update: 'POST /subscriptions/{id}',
})

export const StripeProduct = Noun({
  $type: 'Stripe.Product',
  $context: 'https://schema.org.ai',

  id: 'Stripe product ID (prod_xxx)',

  $resource: Stripe.Resource({
    path: '/products/{id}',
  }),

  name: 'Product name',
  description: 'Product description',
  active: 'Whether product is active',
  metadata: 'Custom metadata object',
  images: 'Product images',
  default_price: 'Default price ID',

  // Actions
  $update: 'POST /products/{id}',
  $archive: 'POST /products/{id} { active: false }',
})

export const StripePrice = Noun({
  $type: 'Stripe.Price',
  $context: 'https://schema.org.ai',

  id: 'Stripe price ID (price_xxx)',

  $resource: Stripe.Resource({
    path: '/prices/{id}',
  }),

  product: 'Product ID',
  unit_amount: 'Price in cents',
  currency: 'Currency code',
  recurring: 'Recurring config (interval, interval_count)',
  active: 'Whether price is active',
  metadata: 'Custom metadata object',

  // Computed
  amountDollars: ($: any) => $.unit_amount / 100,
  interval: ($: any) => $.recurring?.interval,
})

export const StripeAccount = Noun({
  $type: 'Stripe.Account',
  $context: 'https://schema.org.ai',

  id: 'Stripe account ID (acct_xxx)',

  $resource: Stripe.Resource({
    path: '/accounts/{id}',
  }),

  email: 'Account email',
  country: 'Account country',
  default_currency: 'Default currency',
  business_profile: 'Business profile',
  charges_enabled: 'Whether charges are enabled',
  payouts_enabled: 'Whether payouts are enabled',
  balance: 'Current balance',
})

// =============================================================================
// GITHUB - Code Infrastructure
// =============================================================================

export const Github = Source({
  $type: 'Github',
  base: 'https://api.github.com',
  auth: '$env.GITHUB_TOKEN',
  headers: { Accept: 'application/vnd.github.v3+json' },
})

export const GithubRepo = Noun({
  $type: 'Github.Repo',
  $context: 'https://schema.org.ai',

  // Identity (we choose what to track)
  owner: 'Repository owner',
  name: 'Repository name',

  $resource: Github.Resource({
    path: '/repos/{owner}/{name}',
  }),

  // Synced fields
  description: 'Repository description',
  stargazers_count: 'Star count',
  forks_count: 'Fork count',
  open_issues_count: 'Open issues count',
  language: 'Primary language',
  topics: 'Repository topics',
  license: 'License info',
  private: 'Whether repo is private',
  archived: 'Whether repo is archived',
  pushed_at: 'Last push timestamp',
  created_at: 'Creation timestamp',
  default_branch: 'Default branch name',

  // Computed
  fullName: ($: any) => `${$.owner}/${$.name}`,
  url: ($: any) => `https://github.com/${$.owner}/${$.name}`,
  stars: ($: any) => $.stargazers_count,
  forks: ($: any) => $.forks_count,

  // Actions
  $star: 'PUT /user/starred/{owner}/{name}',
  $unstar: 'DELETE /user/starred/{owner}/{name}',
  $fork: 'POST /repos/{owner}/{name}/forks',
})

export const GithubUser = Noun({
  $type: 'Github.User',
  $context: 'https://schema.org.ai',

  username: 'GitHub username',

  $resource: Github.Resource({
    path: '/users/{username}',
  }),

  name: 'Display name',
  bio: 'User bio',
  company: 'Company name',
  location: 'Location',
  email: 'Public email',
  followers: 'Follower count',
  following: 'Following count',
  public_repos: 'Public repo count',
  avatar_url: 'Avatar URL',
  html_url: 'Profile URL',
  created_at: 'Account creation date',

  // Computed
  url: ($: any) => $.html_url,
})

export const GithubOrganization = Noun({
  $type: 'Github.Organization',
  $context: 'https://schema.org.ai',

  login: 'Organization login',

  $resource: Github.Resource({
    path: '/orgs/{login}',
  }),

  name: 'Organization name',
  description: 'Organization description',
  company: 'Company name',
  location: 'Location',
  email: 'Public email',
  public_repos: 'Public repo count',
  followers: 'Follower count',
  avatar_url: 'Avatar URL',
  html_url: 'Profile URL',
  created_at: 'Account creation date',
})

// =============================================================================
// GOOGLE ADS - Advertising Infrastructure
// =============================================================================

export const Google = Source({
  $type: 'Google',
  base: 'https://googleads.googleapis.com/v14',
  auth: '$env.GOOGLE_ADS_TOKEN',
})

export const GoogleCampaign = Noun({
  $type: 'Google.Campaign',
  $context: 'https://schema.org.ai',

  customerId: 'Google Ads customer ID',
  id: 'Campaign ID',

  $resource: Google.Resource({
    path: '/customers/{customerId}/campaigns/{id}',
  }),

  // Editable settings
  name: 'Campaign name',
  status: 'ENABLED | PAUSED | REMOVED',
  budget: 'Daily budget in micros',

  // Metrics (readonly)
  impressions: 'Total impressions',
  clicks: 'Total clicks',
  conversions: 'Total conversions',
  cost_micros: 'Total cost in micros',

  // Computed
  ctr: ($: any) => $.impressions > 0 ? $.clicks / $.impressions : 0,
  cpc: ($: any) => $.clicks > 0 ? $.cost_micros / $.clicks / 1000000 : 0,
  cpa: ($: any) => $.conversions > 0 ? $.cost_micros / $.conversions / 1000000 : 0,
  costDollars: ($: any) => $.cost_micros / 1000000,

  // Actions
  $pause: 'POST { status: "PAUSED" }',
  $enable: 'POST { status: "ENABLED" }',
  $setBudget: '(amount) => POST { budget: amount }',
})

// =============================================================================
// VERCEL - Deployment Infrastructure
// =============================================================================

export const Vercel = Source({
  $type: 'Vercel',
  base: 'https://api.vercel.com',
  auth: '$env.VERCEL_TOKEN',
})

export const VercelDeployment = Noun({
  $type: 'Vercel.Deployment',
  $context: 'https://schema.org.ai',

  id: 'Deployment ID',

  $resource: Vercel.Resource({
    path: '/v13/deployments/{id}',
  }),

  name: 'Deployment name',
  url: 'Deployment URL',
  state: 'QUEUED | BUILDING | READY | ERROR',
  createdAt: 'Creation timestamp',
  buildingAt: 'Build start timestamp',
  ready: 'Ready timestamp',
  target: 'production | preview',

  // Computed
  isReady: ($: any) => $.state === 'READY',
  isProduction: ($: any) => $.target === 'production',

  // Actions
  $redeploy: 'POST /v13/deployments',
  $delete: 'DELETE /v13/deployments/{id}',
  $promote: 'PATCH /v13/deployments/{id} { target: "production" }',
})

export const VercelProject = Noun({
  $type: 'Vercel.Project',
  $context: 'https://schema.org.ai',

  id: 'Project ID',

  $resource: Vercel.Resource({
    path: '/v9/projects/{id}',
  }),

  name: 'Project name',
  framework: 'Framework (next, remix, etc)',
  nodeVersion: 'Node.js version',
  buildCommand: 'Build command',
  outputDirectory: 'Output directory',
  rootDirectory: 'Root directory',

  // Actions
  $deploy: 'POST /v13/deployments { project: id }',
})

// =============================================================================
// NPM - Package Infrastructure
// =============================================================================

export const NPM = Source({
  $type: 'NPM',
  base: 'https://registry.npmjs.org',
  auth: '$env.NPM_TOKEN',
})

export const NPMPackage = Noun({
  $type: 'NPM.Package',
  $context: 'https://schema.org.ai',

  name: 'Package name',

  $resource: NPM.Resource({
    path: '/{name}',
  }),

  description: 'Package description',
  version: 'Latest version',
  license: 'License',
  homepage: 'Homepage URL',
  repository: 'Repository URL',
  keywords: 'Package keywords',
  author: 'Author info',
  maintainers: 'Maintainer list',

  // Computed
  npmUrl: ($: any) => `https://www.npmjs.com/package/${$.name}`,
})

// =============================================================================
// DNS - Domain Infrastructure
// =============================================================================

export const DNS = Source({
  $type: 'DNS',
  base: 'https://dns.google/resolve',
  auth: '', // No auth needed for public DNS
})

export const DNSRecord = Noun({
  $type: 'DNS.Record',
  $context: 'https://schema.org.ai',

  domain: 'Domain name',
  type: 'A | AAAA | CNAME | MX | TXT | NS',

  $resource: DNS.Resource({
    path: '?name={domain}&type={type}',
  }),

  // Response fields
  records: 'DNS records',
  ttl: 'Time to live',
  status: 'Query status',
})

// =============================================================================
// ANALYTICS - Metrics Infrastructure
// =============================================================================

export const Analytics = Source({
  $type: 'Analytics',
  base: '$env.ANALYTICS_API_URL',
  auth: '$env.ANALYTICS_API_KEY',
})

export const AnalyticsPage = Noun({
  $type: 'Analytics.Page',
  $context: 'https://schema.org.ai',

  url: 'Page URL',

  $resource: Analytics.Resource({
    path: '/pages/{url}',
  }),

  visitors: 'Unique visitors',
  pageviews: 'Total pageviews',
  bounceRate: 'Bounce rate',
  avgTimeOnPage: 'Average time on page',
  conversions: 'Total conversions',
  conversionRate: 'Conversion rate',
})

// =============================================================================
// EXPORT ALL SOURCES
// =============================================================================

export const Sources = {
  Stripe: {
    Customer: StripeCustomer,
    Subscription: StripeSubscription,
    Product: StripeProduct,
    Price: StripePrice,
    Account: StripeAccount,
  },
  Github: {
    Repo: GithubRepo,
    User: GithubUser,
    Organization: GithubOrganization,
  },
  Google: {
    Campaign: GoogleCampaign,
  },
  Vercel: {
    Deployment: VercelDeployment,
    Project: VercelProject,
  },
  NPM: {
    Package: NPMPackage,
  },
  DNS: {
    Record: DNSRecord,
  },
  Analytics: {
    Page: AnalyticsPage,
  },
}
