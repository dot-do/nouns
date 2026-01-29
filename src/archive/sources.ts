/**
 * Sources & Resources - External API Definitions
 *
 * Sources define external APIs (auth, rate limits, base URLs).
 * Resources define specific endpoints within sources.
 * Transformations map external data to noun schemas.
 *
 * =============================================================================
 * PATTERN
 * =============================================================================
 *
 * Source → Resource → Transform → Noun
 *
 * Source:   External API configuration (auth, limits, base URL)
 * Resource: Specific endpoint within a source (path, method, params)
 * Transform: JSONPath-like mapping from response to fields
 * Noun:     DO that consumes the enrichment
 *
 * =============================================================================
 */

import { DO } from './do/do'

// =============================================================================
// SOURCE DEFINITIONS
// =============================================================================

/**
 * GitHub API Source
 */
export const GitHub = DO({
  $type: 'Source',
  $id: 'github',
  $version: 1,

  name: 'GitHub API',
  baseUrl: 'https://api.github.com',

  // Auth configuration
  auth: {
    type: 'bearer',
    token: '$env.GITHUB_TOKEN',
  },

  // Rate limiting
  rateLimit: {
    requests: 5000,
    window: '1h',
    header: 'X-RateLimit-Remaining',
  },

  // Default headers
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'dotdo-nouns',
  },
})

/**
 * NPM Registry Source
 */
export const NPM = DO({
  $type: 'Source',
  $id: 'npm',
  $version: 1,

  name: 'NPM Registry',
  baseUrl: 'https://registry.npmjs.org',

  // No auth for public registry
  auth: null,

  rateLimit: {
    requests: 1000,
    window: '10m',
  },

  headers: {
    Accept: 'application/json',
  },
})

/**
 * Stripe API Source
 */
export const Stripe = DO({
  $type: 'Source',
  $id: 'stripe',
  $version: 1,

  name: 'Stripe API',
  baseUrl: 'https://api.stripe.com/v1',

  auth: {
    type: 'basic',
    username: '$env.STRIPE_SECRET_KEY',
    password: '', // Stripe uses empty password with key as username
  },

  rateLimit: {
    requests: 100,
    window: '1s',
  },

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

/**
 * Google Ads API Source
 */
export const GoogleAds = DO({
  $type: 'Source',
  $id: 'googleads',
  $version: 1,

  name: 'Google Ads API',
  baseUrl: 'https://googleads.googleapis.com/v14',

  auth: {
    type: 'oauth2',
    accessToken: '$env.GOOGLE_ADS_ACCESS_TOKEN',
    refreshToken: '$env.GOOGLE_ADS_REFRESH_TOKEN',
    clientId: '$env.GOOGLE_ADS_CLIENT_ID',
    clientSecret: '$env.GOOGLE_ADS_CLIENT_SECRET',
  },

  headers: {
    'developer-token': '$env.GOOGLE_ADS_DEVELOPER_TOKEN',
    'login-customer-id': '$env.GOOGLE_ADS_LOGIN_CUSTOMER_ID',
  },
})

/**
 * WHOIS/RDAP Source
 */
export const WHOIS = DO({
  $type: 'Source',
  $id: 'whois',
  $version: 1,

  name: 'RDAP/WHOIS',
  baseUrl: 'https://rdap.org',

  auth: null,

  rateLimit: {
    requests: 60,
    window: '1m',
  },
})

/**
 * DNS Lookup Source (via DNS-over-HTTPS)
 */
export const DNS = DO({
  $type: 'Source',
  $id: 'dns',
  $version: 1,

  name: 'DNS over HTTPS',
  baseUrl: 'https://cloudflare-dns.com/dns-query',

  auth: null,

  headers: {
    Accept: 'application/dns-json',
  },

  rateLimit: {
    requests: 1000,
    window: '1m',
  },
})

/**
 * IP Geolocation Source
 */
export const IPInfo = DO({
  $type: 'Source',
  $id: 'ipinfo',
  $version: 1,

  name: 'IPInfo.io',
  baseUrl: 'https://ipinfo.io',

  auth: {
    type: 'bearer',
    token: '$env.IPINFO_TOKEN',
  },

  rateLimit: {
    requests: 50000,
    window: '1M', // Monthly
  },
})

/**
 * Geonames Source
 */
export const Geonames = DO({
  $type: 'Source',
  $id: 'geonames',
  $version: 1,

  name: 'Geonames',
  baseUrl: 'https://secure.geonames.org',

  auth: {
    type: 'query',
    param: 'username',
    value: '$env.GEONAMES_USERNAME',
  },

  rateLimit: {
    requests: 2000,
    window: '1h',
  },
})

/**
 * LinkedIn API Source
 */
export const LinkedIn = DO({
  $type: 'Source',
  $id: 'linkedin',
  $version: 1,

  name: 'LinkedIn API',
  baseUrl: 'https://api.linkedin.com/v2',

  auth: {
    type: 'oauth2',
    accessToken: '$env.LINKEDIN_ACCESS_TOKEN',
  },

  rateLimit: {
    requests: 100,
    window: '1d',
  },
})

/**
 * Twitter/X API Source
 */
export const Twitter = DO({
  $type: 'Source',
  $id: 'twitter',
  $version: 1,

  name: 'Twitter/X API v2',
  baseUrl: 'https://api.twitter.com/2',

  auth: {
    type: 'bearer',
    token: '$env.TWITTER_BEARER_TOKEN',
  },

  rateLimit: {
    requests: 450, // Varies by endpoint
    window: '15m',
  },
})

// =============================================================================
// RESOURCE DEFINITIONS
// =============================================================================

/**
 * GitHub Repository Resource
 */
export const GitHubRepoResource = DO({
  $type: 'Resource',
  $id: 'github/repos',
  $version: 1,

  source: '->GitHub',
  path: '/repos/{owner}/{repo}',
  method: 'GET',

  // Path parameters
  params: {
    owner: 'Repository owner/org',
    repo: 'Repository name',
  },

  // Response transformation (JSONPath-like)
  transform: {
    description: '$.description',
    stars: '$.stargazers_count',
    forks: '$.forks_count',
    openIssues: '$.open_issues_count',
    language: '$.language',
    topics: '$.topics',
    license: '$.license.spdx_id',
    defaultBranch: '$.default_branch',
    private: '$.private',
    archived: '$.archived',
    createdAt: '$.created_at',
    updatedAt: '$.updated_at',
    pushedAt: '$.pushed_at',
    htmlUrl: '$.html_url',
    cloneUrl: '$.clone_url',
    homepage: '$.homepage',
  },

  // Cache configuration
  cache: '1h',
})

/**
 * GitHub User Resource
 */
export const GitHubUserResource = DO({
  $type: 'Resource',
  $id: 'github/users',
  $version: 1,

  source: '->GitHub',
  path: '/users/{username}',
  method: 'GET',

  params: {
    username: 'GitHub username',
  },

  transform: {
    name: '$.name',
    bio: '$.bio',
    company: '$.company',
    location: '$.location',
    email: '$.email',
    blog: '$.blog',
    twitterUsername: '$.twitter_username',
    avatarUrl: '$.avatar_url',
    publicRepos: '$.public_repos',
    publicGists: '$.public_gists',
    followers: '$.followers',
    following: '$.following',
    createdAt: '$.created_at',
  },

  cache: '1h',
})

/**
 * NPM Package Resource
 */
export const NPMPackageResource = DO({
  $type: 'Resource',
  $id: 'npm/package',
  $version: 1,

  source: '->NPM',
  path: '/{package}',
  method: 'GET',

  params: {
    package: 'Package name (scoped: @scope/name)',
  },

  transform: {
    description: '$.description',
    latestVersion: '$.dist-tags.latest',
    license: '$.license',
    homepage: '$.homepage',
    repository: '$.repository.url',
    author: '$.author.name',
    maintainers: '$.maintainers[*].name',
    keywords: '$.keywords',
    // Access latest version's dependencies
    dependencies: '$.versions[$.dist-tags.latest].dependencies',
    devDependencies: '$.versions[$.dist-tags.latest].devDependencies',
    peerDependencies: '$.versions[$.dist-tags.latest].peerDependencies',
  },

  cache: '1h',
})

/**
 * Stripe Customer Resource
 */
export const StripeCustomerResource = DO({
  $type: 'Resource',
  $id: 'stripe/customers',
  $version: 1,

  source: '->Stripe',
  path: '/customers/{id}',
  method: 'GET',

  params: {
    id: 'Stripe customer ID (cus_...)',
  },

  transform: {
    email: '$.email',
    name: '$.name',
    phone: '$.phone',
    currency: '$.currency',
    balance: '$.balance',
    created: '$.created', // Unix timestamp
    delinquent: '$.delinquent',
    defaultSource: '$.default_source',
    metadata: '$.metadata',
    address: {
      line1: '$.address.line1',
      line2: '$.address.line2',
      city: '$.address.city',
      state: '$.address.state',
      postalCode: '$.address.postal_code',
      country: '$.address.country',
    },
  },

  cache: '5m',
})

/**
 * Stripe Subscription Resource
 */
export const StripeSubscriptionResource = DO({
  $type: 'Resource',
  $id: 'stripe/subscriptions',
  $version: 1,

  source: '->Stripe',
  path: '/subscriptions/{id}',
  method: 'GET',

  params: {
    id: 'Stripe subscription ID (sub_...)',
  },

  transform: {
    status: '$.status',
    currentPeriodStart: '$.current_period_start',
    currentPeriodEnd: '$.current_period_end',
    cancelAtPeriodEnd: '$.cancel_at_period_end',
    canceledAt: '$.canceled_at',
    trialStart: '$.trial_start',
    trialEnd: '$.trial_end',
    customer: '$.customer',
    // First item's price info
    priceId: '$.items.data[0].price.id',
    priceAmount: '$.items.data[0].price.unit_amount',
    priceCurrency: '$.items.data[0].price.currency',
    priceInterval: '$.items.data[0].price.recurring.interval',
    quantity: '$.items.data[0].quantity',
  },

  cache: '5m',
})

/**
 * DNS Query Resource
 */
export const DNSQueryResource = DO({
  $type: 'Resource',
  $id: 'dns/query',
  $version: 1,

  source: '->DNS',
  path: '',
  method: 'GET',

  params: {
    name: 'Domain name to query',
    type: 'Record type (A, AAAA, MX, TXT, NS, CNAME)',
  },

  // Query string params
  query: {
    name: '{name}',
    type: '{type}',
  },

  // DNS JSON response format
  transform: {
    records: '$.Answer[*].data',
    ttl: '$.Answer[0].TTL',
    status: '$.Status',
  },

  cache: '5m',
})

/**
 * WHOIS/RDAP Domain Resource
 */
export const WHOISDomainResource = DO({
  $type: 'Resource',
  $id: 'whois/domain',
  $version: 1,

  source: '->WHOIS',
  path: '/domain/{domain}',
  method: 'GET',

  params: {
    domain: 'Domain name',
  },

  transform: {
    // RDAP response format
    registrar: '$.entities[?(@.roles[0]=="registrar")].vcardArray[1][?(@[0]=="fn")][3]',
    registrarUrl: '$.entities[?(@.roles[0]=="registrar")].links[0].href',
    status: '$.status',
    nameServers: '$.nameservers[*].ldhName',
    // Events
    createdDate: '$.events[?(@.eventAction=="registration")].eventDate',
    expirationDate: '$.events[?(@.eventAction=="expiration")].eventDate',
    updatedDate: '$.events[?(@.eventAction=="last changed")].eventDate',
    // Registrant (often redacted)
    registrantName: '$.entities[?(@.roles[0]=="registrant")].vcardArray[1][?(@[0]=="fn")][3]',
    registrantOrg: '$.entities[?(@.roles[0]=="registrant")].vcardArray[1][?(@[0]=="org")][3]',
  },

  cache: '24h',
})

/**
 * IP Info Resource
 */
export const IPInfoResource = DO({
  $type: 'Resource',
  $id: 'ipinfo/lookup',
  $version: 1,

  source: '->IPInfo',
  path: '/{ip}',
  method: 'GET',

  params: {
    ip: 'IP address',
  },

  transform: {
    hostname: '$.hostname',
    city: '$.city',
    region: '$.region',
    country: '$.country',
    location: '$.loc', // "lat,lng"
    org: '$.org', // "AS#### Org Name"
    postal: '$.postal',
    timezone: '$.timezone',
    // Parsed from org
    asn: '$.org | split(" ")[0] | replace("AS", "")',
    asOrg: '$.org | split(" ")[1:]  | join(" ")',
  },

  cache: '24h',
})

// =============================================================================
// EXPORTS
// =============================================================================

export const Sources = {
  GitHub,
  NPM,
  Stripe,
  GoogleAds,
  WHOIS,
  DNS,
  IPInfo,
  Geonames,
  LinkedIn,
  Twitter,
}

export const Resources = {
  GitHubRepoResource,
  GitHubUserResource,
  NPMPackageResource,
  StripeCustomerResource,
  StripeSubscriptionResource,
  DNSQueryResource,
  WHOISDomainResource,
  IPInfoResource,
}
