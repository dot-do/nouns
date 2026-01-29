import { DO } from './do/do'

export const Product = DO({
  $type: 'Product',
  $version: 1,

  // Identity
  name: 'Product name',
  slug: 'URL-friendly identifier',
  tagline: 'One-line description',
  description: 'Full product description',

  // Classification
  type: 'Physical | Digital | Hybrid',
  category: 'Product category ~>ProductCategory',
  industry: 'Target industry ~>Industry',

  // Lifecycle
  status: 'Concept | Development | Beta | Live | Sunset | Discontinued',
  version: 'Current version',
  launchDate: 'Launch date (date)',

  // Ownership
  owner: 'Owning business ->Business',
  team: 'Product team ->Team',

  // Features
  features: [{
    name: 'Feature name',
    description: 'What it does',
    status: 'Planned | Development | Beta | Released | Deprecated',
  }],

  // Pricing
  pricing: [{
    name: 'Tier name',
    price: 'Price in USD (number)',
    frequency: 'OneTime | Monthly | Annual',
    features: ['Included features'],
  }],

  // Relationships
  variants: ['Product variants ->Product'],
  bundles: ['Bundled products ->Product'],
  complements: ['Complementary products ~>Product'],
  alternatives: ['Competing products ~>Product'],

  // Users
  users: ['<- User.products'],
  customers: ['Target customers ->IdealCustomerProfile'],

  // Metrics
  metrics: {
    users: 'Total users (number)',
    revenue: 'Product revenue (number)',
    nps: 'Net promoter score (number)',
    rating: 'Average rating (number)',
  },

  // Generated
  positioning: { mdx: 'Generate positioning statement for {name} targeting {customers}' },
  comparison: { mdx: 'Compare {name} vs {alternatives} for {customers}' },

  onProductLaunched: (p, $) => $.emit('product.launched', { id: p.$id }),
})

export const Service = DO({
  $type: 'Service',
  $version: 1,

  // Identity
  name: 'Service name',
  slug: 'URL identifier',
  tagline: 'Value proposition',
  description: 'What the service delivers',

  // Classification
  type: 'Professional | Technical | Managed | Consulting | Support | Creative',
  category: 'Service category ~>ServiceCategory',
  delivery: 'Onsite | Remote | Hybrid | SelfService | Automated',
  engagement: 'Project | Retainer | Subscription | Transaction | Outcome',

  // Provider
  provider: 'Service provider ->Business',
  team: 'Service delivery team ->Team',

  // Offering
  deliverables: ['What customer receives'],
  sla: {
    responseTime: 'Response time commitment',
    resolution: 'Resolution time commitment',
    uptime: 'Uptime guarantee (number)',
  },

  // Pricing
  pricing: {
    model: 'Fixed | Hourly | Retainer | Usage | Outcome',
    basePrice: 'Starting price (number)',
    currency: 'USD | EUR | GBP',
  },

  // Process
  intake: 'Client onboarding process ->Workflow',
  workflow: 'Service delivery workflow ->Workflow',
  qualityGates: ['Quality checkpoints ->QualityGate'],

  // Relationships
  clients: ['<- Client.services'],
  prerequisites: ['Required services ->Service'],
  upsells: ['Upsell opportunities ->Service'],

  // Generated
  proposal: { mdx: 'Generate service proposal for {name} to {client}' },
  caseStudy: { mdx: 'Generate case study for {name} engagement' },
})

export const App = DO({
  $type: 'App',
  $version: 1,

  // Identity
  name: 'Application name',
  slug: 'URL identifier',
  tagline: 'One-line description',
  description: 'Full description',
  icon: 'App icon URL',

  // Classification
  type: 'Web | Mobile | Desktop | CLI | API | Embedded',
  category: 'App category ~>AppCategory',
  platform: 'iOS | Android | Web | macOS | Windows | Linux | CrossPlatform',

  // Technical
  stack: ['Tech stack components'],
  repository: 'Source repository URL',
  documentation: 'Documentation URL',

  // Lifecycle
  status: 'Development | Alpha | Beta | Production | Maintenance | Sunset',
  version: 'Current version',
  releaseDate: 'Initial release date (date)',

  // Ownership
  owner: 'Owning entity ->Business',
  maintainers: ['<- Developer.maintains'],

  // Users
  users: ['<- User.apps'],
  targetUsers: ['Target user profiles ->IdealCustomerProfile'],

  // Features
  features: [{
    name: 'Feature name',
    description: 'What it does',
    status: 'Planned | InProgress | Released | Deprecated',
  }],

  // Integrations
  integrations: ['Connected services ->Integration'],
  apis: ['Exposed APIs ->API'],
  webhooks: ['Webhook endpoints ->Webhook'],

  // Metrics
  metrics: {
    downloads: 'Total downloads (number)',
    activeUsers: 'Active users (number)',
    rating: 'App store rating (number)',
    reviews: 'Number of reviews (number)',
  },

  // Monitoring
  healthCheck: { mdx: 'Check health status of {name}' },
  everyMinute: ($) => $.call('checkHealth', []),
  onErrorDetected: (err, $) => $.call('alertOncall', [err]),
})
