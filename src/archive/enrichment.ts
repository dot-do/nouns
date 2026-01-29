/**
 * Enrichment - Entities with External API Data
 *
 * This module defines entities that are enriched from external APIs.
 * Unlike $seed (one-time reference data import), enrichment fetches
 * live data from authoritative external sources.
 *
 * =============================================================================
 * ARCHITECTURE
 * =============================================================================
 *
 * Source → Resource → Noun
 *
 * Source:   External API configuration (see sources.ts)
 *           - Auth, rate limits, base URL, headers
 *
 * Resource: Specific endpoint within a source (see sources.ts)
 *           - Path pattern, parameters, transformation rules
 *
 * Noun:     Entity that consumes enrichment
 *           - $enrich references Resource
 *           - Fields map from transformed resource data
 *
 * =============================================================================
 * ENRICHMENT SYNTAX
 * =============================================================================
 *
 * // Reference a Resource for enrichment
 * $enrich: '->GitHubRepoResource',
 *
 * // Or inline (for simple cases)
 * $enrich: {
 *   resource: '->GitHubRepoResource',
 *   params: { owner: '{owner}', repo: '{name}' },
 * },
 *
 * // Multiple sources
 * $enrich: [
 *   { resource: '->WHOISDomainResource', params: { domain: '{name}' } },
 *   { resource: '->DNSQueryResource', params: { name: '{name}', type: 'A' } },
 * ],
 *
 * // Field mapping from enriched data
 * stars: '$resource.stars (number)',  // From transformed resource
 *
 * =============================================================================
 */

import { DO } from './do/do'

// =============================================================================
// CODE & PACKAGES
// =============================================================================

/**
 * GitHubRepo - Enriched from GitHub API
 *
 * Uses: GitHubRepoResource (from sources.ts)
 */
export const GitHubRepo = DO({
  $type: 'GitHubRepo',
  $version: 1,

  // Identity (lookup key - passed to Resource params)
  owner: 'Repository owner/org',
  name: 'Repository name',

  // Enrichment from Resource
  $enrich: {
    resource: '->GitHubRepoResource',
    params: { owner: '{owner}', repo: '{name}' },
  },

  // Fields mapped from transformed resource data
  // The Resource's transform maps GitHub API → these field names
  description: '$resource.description',
  stars: '$resource.stars (number)',
  forks: '$resource.forks (number)',
  openIssues: '$resource.openIssues (number)',
  language: '$resource.language',
  topics: ['$resource.topics'],
  license: '$resource.license',
  defaultBranch: '$resource.defaultBranch',
  private: '$resource.private (boolean)',
  archived: '$resource.archived (boolean)',
  createdAt: '$resource.createdAt (date)',
  updatedAt: '$resource.updatedAt (date)',
  pushedAt: '$resource.pushedAt (date)',
  htmlUrl: '$resource.htmlUrl',
  cloneUrl: '$resource.cloneUrl',
  homepage: '$resource.homepage',

  // Computed
  fullName: (repo) => `${repo.owner}/${repo.name}`,
})

/**
 * NPMPackage - Enriched from NPM Registry
 *
 * Uses: NPMPackageResource (from sources.ts)
 */
export const NPMPackage = DO({
  $type: 'NPMPackage',
  $version: 1,

  // Identity
  name: 'Package name (e.g., lodash or @types/node)',

  // Enrichment from Resource
  $enrich: {
    resource: '->NPMPackageResource',
    params: { package: '{name}' },
  },

  // Fields mapped from transformed resource
  description: '$resource.description',
  version: '$resource.latestVersion',
  license: '$resource.license',
  homepage: '$resource.homepage',
  repository: '$resource.repository',
  author: '$resource.author',
  maintainers: ['$resource.maintainers'],
  keywords: ['$resource.keywords'],
  dependencies: '$resource.dependencies',
  devDependencies: '$resource.devDependencies',
  peerDependencies: '$resource.peerDependencies',

  // Related
  github: 'Link to GitHub repo ->GitHubRepo',
})

// =============================================================================
// FINANCIALS (Stripe)
// =============================================================================

/**
 * StripeCustomer - Enriched from Stripe API
 *
 * Uses: StripeCustomerResource (from sources.ts)
 */
export const StripeCustomer = DO({
  $type: 'StripeCustomer',
  $version: 1,

  // Identity
  stripeId: 'Stripe customer ID (cus_...)',

  // Enrichment from Resource
  $enrich: {
    resource: '->StripeCustomerResource',
    params: { id: '{stripeId}' },
  },

  // Fields mapped from transformed resource
  email: '$resource.email',
  name: '$resource.name',
  phone: '$resource.phone',
  currency: '$resource.currency',
  balance: '$resource.balance (number)',
  delinquent: '$resource.delinquent (boolean)',
  created: '$resource.created (date)',
  defaultSource: '$resource.defaultSource',
  metadata: '$resource.metadata',
  address: '$resource.address',

  // Relationships
  subscriptions: ['<-StripeSubscription.customer'],
  invoices: ['<-StripeInvoice.customer'],
  customer: 'Link to internal Customer ->Customer',
})

/**
 * StripeSubscription - Enriched from Stripe API
 *
 * Uses: StripeSubscriptionResource (from sources.ts)
 */
export const StripeSubscription = DO({
  $type: 'StripeSubscription',
  $version: 1,

  // Identity
  stripeId: 'Stripe subscription ID (sub_...)',

  // Enrichment from Resource
  $enrich: {
    resource: '->StripeSubscriptionResource',
    params: { id: '{stripeId}' },
  },

  // Fields mapped from transformed resource
  status: '$resource.status', // active | past_due | canceled | etc
  currentPeriodStart: '$resource.currentPeriodStart (date)',
  currentPeriodEnd: '$resource.currentPeriodEnd (date)',
  cancelAtPeriodEnd: '$resource.cancelAtPeriodEnd (boolean)',
  canceledAt: '$resource.canceledAt (date)',
  trialStart: '$resource.trialStart (date)',
  trialEnd: '$resource.trialEnd (date)',

  // Price info (from transformed resource)
  priceId: '$resource.priceId',
  priceAmount: '$resource.priceAmount (number)',
  priceCurrency: '$resource.priceCurrency',
  priceInterval: '$resource.priceInterval',
  quantity: '$resource.quantity (number)',

  // Relationships
  customer: '->StripeCustomer',
})

/**
 * StripeInvoice - Enriched from Stripe API
 */
export const StripeInvoice = DO({
  $type: 'StripeInvoice',
  $version: 1,

  stripeId: 'Stripe invoice ID (in_...)',

  $enrich: {
    source: 'stripe://invoices/{stripeId}',
    cache: '1h',
    auth: '$env.STRIPE_SECRET_KEY',
  },

  status: '$stripe.status', // draft | open | paid | void | uncollectible
  amountDue: '$stripe.amount_due (number)',
  amountPaid: '$stripe.amount_paid (number)',
  currency: '$stripe.currency',
  invoicePdf: '$stripe.invoice_pdf',
  hostedInvoiceUrl: '$stripe.hosted_invoice_url',
  created: '$stripe.created (date)',
  dueDate: '$stripe.due_date (date)',
  paidAt: '$stripe.status_transitions.paid_at (date)',

  customer: '->StripeCustomer',
  subscription: '->StripeSubscription',
})

// =============================================================================
// ADVERTISING (Google Ads)
// =============================================================================

/**
 * GoogleAdsCampaign - Enriched from Google Ads API
 */
export const GoogleAdsCampaign = DO({
  $type: 'GoogleAdsCampaign',
  $version: 1,

  campaignId: 'Google Ads campaign ID',
  customerId: 'Google Ads customer ID',

  $enrich: {
    source: 'googleads://customers/{customerId}/campaigns/{campaignId}',
    cache: '15m',
    auth: '$env.GOOGLE_ADS_TOKEN',
  },

  // Campaign info
  name: '$gads.campaign.name',
  status: '$gads.campaign.status', // ENABLED | PAUSED | REMOVED
  type: '$gads.campaign.advertising_channel_type',
  budget: '$gads.campaign.campaign_budget (number)',

  // Metrics (from reports)
  impressions: '$gads.metrics.impressions (number)',
  clicks: '$gads.metrics.clicks (number)',
  ctr: '$gads.metrics.ctr (number)',
  averageCpc: '$gads.metrics.average_cpc (number)',
  cost: '$gads.metrics.cost_micros (number)',
  conversions: '$gads.metrics.conversions (number)',
  conversionRate: '$gads.metrics.conversions_from_interactions_rate (number)',
  costPerConversion: '$gads.metrics.cost_per_conversion (number)',

  // Computed
  costDollars: (c) => c.cost / 1_000_000,

  // Relationships
  campaign: 'Link to internal Campaign ->Campaign',
  experiment: 'Link to Experiment ->Experiment',
})

// =============================================================================
// DOMAINS & DNS
// =============================================================================

/**
 * Domain - Enriched from WHOIS/RDAP and DNS
 *
 * Uses: WHOISDomainResource, DNSQueryResource (from sources.ts)
 * Demonstrates multiple enrichment sources with prefixes.
 */
export const Domain = DO({
  $type: 'Domain',
  $version: 1,

  name: 'Domain name (e.g., example.com)',

  // Multiple enrichment sources with prefixes
  $enrich: [
    {
      resource: '->WHOISDomainResource',
      params: { domain: '{name}' },
      prefix: 'whois',
    },
    {
      resource: '->DNSQueryResource',
      params: { name: '{name}', type: 'A' },
      prefix: 'dnsA',
    },
    {
      resource: '->DNSQueryResource',
      params: { name: '{name}', type: 'MX' },
      prefix: 'dnsMX',
    },
    {
      resource: '->DNSQueryResource',
      params: { name: '{name}', type: 'NS' },
      prefix: 'dnsNS',
    },
  ],

  // WHOIS data (from whois-prefixed resource)
  registrar: '$whois.registrar',
  registrarUrl: '$whois.registrarUrl',
  createdDate: '$whois.createdDate (date)',
  expirationDate: '$whois.expirationDate (date)',
  updatedDate: '$whois.updatedDate (date)',
  status: ['$whois.status'],
  domainNameServers: ['$whois.nameServers'],

  // Registrant (often redacted)
  registrantName: '$whois.registrantName',
  registrantOrg: '$whois.registrantOrg',

  // DNS records (from dns-prefixed resources)
  aRecords: ['$dnsA.records'],
  mxRecords: ['$dnsMX.records'],
  nsRecords: ['$dnsNS.records'],

  // Computed
  isExpiringSoon: (d) => {
    if (!d.expirationDate) return false
    const days = (new Date(d.expirationDate).getTime() - Date.now()) / 86400000
    return days < 30
  },

  // Relationships
  business: 'Owner business ->Business',
})

/**
 * IPAddress - Enriched from IP/ASN lookup
 *
 * Uses: IPInfoResource (from sources.ts)
 */
export const IPAddress = DO({
  $type: 'IPAddress',
  $version: 1,

  address: 'IP address (v4 or v6)',

  $enrich: {
    resource: '->IPInfoResource',
    params: { ip: '{address}' },
  },

  // ASN info (from transformed resource)
  asn: '$resource.asn (number)',
  asOrg: '$resource.asOrg',
  hostname: '$resource.hostname',

  // Geolocation
  country: '$resource.country',
  countryCode: '$resource.countryCode',
  region: '$resource.region',
  city: '$resource.city',
  postal: '$resource.postal',
  location: '$resource.location', // "lat,lng" string
  timezone: '$resource.timezone',

  // Computed lat/lng from location string
  latitude: (ip) => ip.location?.split(',')[0] ? parseFloat(ip.location.split(',')[0]) : null,
  longitude: (ip) => ip.location?.split(',')[1] ? parseFloat(ip.location.split(',')[1]) : null,
})

// =============================================================================
// GEOGRAPHIC DATA
// =============================================================================

/**
 * Place - Enriched from Geonames
 */
export const Place = DO({
  $type: 'Place',
  $version: 1,

  geonameId: 'Geonames ID (number)',

  $enrich: {
    source: 'geonames://get?geonameId={geonameId}',
    cache: '7d',
  },

  name: '$geonames.name',
  asciiName: '$geonames.asciiName',
  alternateNames: ['$geonames.alternateNames'],
  latitude: '$geonames.lat (number)',
  longitude: '$geonames.lng (number)',
  featureClass: '$geonames.fcl',
  featureCode: '$geonames.fcode',
  countryCode: '$geonames.countryCode',
  countryName: '$geonames.countryName',
  population: '$geonames.population (number)',
  elevation: '$geonames.elevation (number)',
  timezone: '$geonames.timezone.timeZoneId',
  adminName1: '$geonames.adminName1', // State/Province
  adminName2: '$geonames.adminName2', // County
})

// =============================================================================
// PRODUCTS (GS1/GTIN)
// =============================================================================

/**
 * GTINProduct - Enriched from GS1/UPC database
 */
export const GTINProduct = DO({
  $type: 'GTINProduct',
  $version: 1,

  gtin: 'GTIN/UPC/EAN barcode',

  $enrich: {
    source: 'gs1://products/{gtin}',
    cache: '7d',
  },

  brandName: '$gs1.brandName',
  productName: '$gs1.productDescription',
  category: '$gs1.gpcCategoryCode',
  categoryName: '$gs1.gpcCategoryName',
  netContent: '$gs1.netContent',
  netContentUom: '$gs1.netContentUom',
  imageUrl: '$gs1.imageUrl',
  manufacturer: '$gs1.informationProviderName',
  countryOfOrigin: '$gs1.countryOfOrigin',

  // Link to internal product
  product: 'Internal product ->Product',
})

// =============================================================================
// SOCIAL PROFILES
// =============================================================================

/**
 * LinkedInProfile - Enriched from LinkedIn
 */
export const LinkedInProfile = DO({
  $type: 'LinkedInProfile',
  $version: 1,

  profileUrl: 'LinkedIn profile URL or vanity name',

  $enrich: {
    source: 'linkedin://people/{profileUrl}',
    cache: '24h',
    auth: '$env.LINKEDIN_ACCESS_TOKEN',
  },

  firstName: '$linkedin.firstName',
  lastName: '$linkedin.lastName',
  headline: '$linkedin.headline',
  summary: '$linkedin.summary',
  location: '$linkedin.locationName',
  industry: '$linkedin.industryName',
  profilePicture: '$linkedin.profilePicture',
  connections: '$linkedin.numConnections (number)',

  // Current position
  currentTitle: '$linkedin.positions[0].title',
  currentCompany: '$linkedin.positions[0].companyName',

  // Link to Person
  person: '->Person',
})

/**
 * GitHubProfile - Enriched from GitHub
 */
export const GitHubProfile = DO({
  $type: 'GitHubProfile',
  $version: 1,

  username: 'GitHub username',

  $enrich: {
    source: 'github://users/{username}',
    cache: '1h',
  },

  name: '$github.name',
  bio: '$github.bio',
  company: '$github.company',
  location: '$github.location',
  email: '$github.email',
  blog: '$github.blog',
  twitterUsername: '$github.twitter_username',
  avatarUrl: '$github.avatar_url',
  publicRepos: '$github.public_repos (number)',
  publicGists: '$github.public_gists (number)',
  followers: '$github.followers (number)',
  following: '$github.following (number)',
  createdAt: '$github.created_at (date)',

  // Relationships
  person: '->Person',
  repos: ['<-GitHubRepo.owner'],
})

/**
 * TwitterProfile - Enriched from Twitter/X API
 */
export const TwitterProfile = DO({
  $type: 'TwitterProfile',
  $version: 1,

  username: 'Twitter/X username (without @)',

  $enrich: {
    source: 'twitter://users/by/username/{username}',
    cache: '1h',
    auth: '$env.TWITTER_BEARER_TOKEN',
  },

  id: '$twitter.data.id',
  name: '$twitter.data.name',
  description: '$twitter.data.description',
  location: '$twitter.data.location',
  url: '$twitter.data.url',
  profileImageUrl: '$twitter.data.profile_image_url',
  verified: '$twitter.data.verified (boolean)',
  followersCount: '$twitter.data.public_metrics.followers_count (number)',
  followingCount: '$twitter.data.public_metrics.following_count (number)',
  tweetCount: '$twitter.data.public_metrics.tweet_count (number)',
  listedCount: '$twitter.data.public_metrics.listed_count (number)',
  createdAt: '$twitter.data.created_at (date)',

  person: '->Person',
})

// =============================================================================
// EMAIL VALIDATION
// =============================================================================

/**
 * EmailValidation - Enriched from email validation service
 */
export const EmailValidation = DO({
  $type: 'EmailValidation',
  $version: 1,

  email: 'Email address to validate',

  $enrich: {
    source: 'email://validate/{email}',
    cache: '7d',
  },

  isValid: '$email.is_valid (boolean)',
  isDeliverable: '$email.is_deliverable (boolean)',
  isDisposable: '$email.is_disposable (boolean)',
  isRoleAccount: '$email.is_role_account (boolean)',
  isFreeProvider: '$email.is_free_provider (boolean)',
  mxFound: '$email.mx_found (boolean)',
  domain: '$email.domain',
  provider: '$email.provider',
  score: '$email.score (number)', // 0-100 deliverability score

  // Suggestions
  didYouMean: '$email.did_you_mean',
})

// =============================================================================
// EXPORTS
// =============================================================================

export const EnrichmentEntities = {
  // Code & Packages
  GitHubRepo,
  NPMPackage,

  // Financials
  StripeCustomer,
  StripeSubscription,
  StripeInvoice,

  // Advertising
  GoogleAdsCampaign,

  // Domains & Network
  Domain,
  IPAddress,

  // Geographic
  Place,

  // Products
  GTINProduct,

  // Social Profiles
  LinkedInProfile,
  GitHubProfile,
  TwitterProfile,

  // Email
  EmailValidation,
}
