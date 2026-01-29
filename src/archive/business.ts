import { DO } from './do/do'

export const Business = DO({
  $type: 'Business',
  $version: 1,

  // Identity
  name: 'Legal business name',
  dba: 'Doing business as (trade name)',
  description: 'What the business does',
  tagline: 'One-line value proposition',

  // Classification
  type: 'SoleProp | LLC | Corp | Partnership | Nonprofit | Coop | DAO',
  stage: 'Idea | Validation | MVP | Launch | Growth | Scale | Mature | Exit',
  model: 'B2B | B2C | B2B2C | B2G | C2C | D2C',

  // Temporal
  founded: 'Date incorporated (date)',
  operational: 'Is currently operating (boolean)',

  // Location
  headquarters: {
    city: 'City name',
    state: 'State or province',
    country: 'Country code (ISO 3166)',
    timezone: 'IANA timezone',
  },

  // Team
  teamSize: 'Number of employees (number)',
  founders: ['Founding team members ->Founder'],
  employees: ['<- Employee.employer'],

  // Financials
  revenue: 'Annual revenue in USD (number)',
  profit: 'Annual profit in USD (number)',
  valuation: 'Current valuation in USD (number)',

  // Relationships
  subsidiaries: ['Owned companies ->Business'],
  parent: 'Parent company <-Business',
  partners: ['Strategic partners <->Partnership'],
  investors: ['Investment relationships <->Investment'],
  customers: ['<- Customer.vendor'],
  vendors: ['Vendors used ->Vendor'],

  // Digital presence
  domain: 'Primary web domain',
  website: 'Website URL',
  social: {
    twitter: 'Twitter/X handle',
    linkedin: 'LinkedIn page URL',
    github: 'GitHub organization',
  },

  // Generated
  pitch: { mdx: 'Generate elevator pitch for {name}: {description}' },
  swot: { mdx: 'Generate SWOT analysis for {name} in {industry}' },

  // Events
  onBusinessCreated: (biz, $) => $.emit('business.created', { id: biz.$id }),
  onInvestmentReceived: (inv, $) => $.call('updateValuation', [inv.amount]),

  // Schedules
  everyMonth: ($) => $.call('generateMonthlyReport', []),
})

export const Startup = DO({
  $type: 'Startup',
  $version: 1,

  // Identity
  name: 'Startup name',
  tagline: 'One-line pitch',
  description: 'What the startup does',
  problem: 'Problem being solved',
  solution: 'How it solves the problem',

  // Stage & Progress
  stage: 'PreSeed | Seed | SeriesA | SeriesB | SeriesC | Growth | IPO | Acquired',
  status: 'Active | Pivoting | Zombie | Shutdown | Acquired | IPO',

  // Team
  founders: ['Co-founding team ->Founder'],
  teamSize: 'Current team size (number)',
  hiring: 'Is actively hiring (boolean)',

  // Product
  product: 'Primary product ->Product',
  products: ['All products ->Product'],
  mvpLaunched: 'Has launched MVP (boolean)',
  launchDate: 'Product launch date (date)',

  // Market
  market: 'Target market ->Market',
  industry: 'Primary industry ~>Industry',
  tam: 'Total addressable market in USD (number)',
  sam: 'Serviceable addressable market in USD (number)',
  som: 'Serviceable obtainable market in USD (number)',

  // Customers
  customers: ['Customer segments ->IdealCustomerProfile'],
  earlyAdopters: ['Early adopter profiles ->IdealCustomerProfile'],

  // Funding
  funding: {
    raised: 'Total raised in USD (number)',
    lastRound: 'Amount of last round (number)',
    lastRoundDate: 'Date of last funding (date)',
    runway: 'Months of runway remaining (number)',
  },
  investors: ['Investor relationships <->Investment'],
  pitchDeck: 'URL to pitch deck',

  // Metrics
  metrics: {
    mrr: 'Monthly recurring revenue (number)',
    arr: 'Annual recurring revenue (number)',
    users: 'Total users (number)',
    dau: 'Daily active users (number)',
    mau: 'Monthly active users (number)',
    churn: 'Monthly churn rate (number)',
    nps: 'Net promoter score (number)',
    ltv: 'Customer lifetime value (number)',
    cac: 'Customer acquisition cost (number)',
  },

  // Strategy
  businessModel: 'Business model canvas ->LeanCanvas',
  differentiation: 'How differentiated ->Differentiation',
  storyBrand: 'Brand narrative ->StoryBrand',
  unfairAdvantage: 'Sustainable competitive advantage',

  // Tech
  techStack: ['Technologies used'],
  github: 'GitHub organization URL',

  // Generated content
  pitch: { mdx: 'Generate 60-second pitch for {name} solving {problem}' },
  oneLiner: { mdx: 'Generate one-liner: {name} is {solution} for {customers}' },
  pressRelease: { mdx: 'Generate launch press release for {name}' },

  // Events
  onStartupCreated: (s, $) => $.cascade(s, 'businessModel'),
  onFundingReceived: (funding, $) => $.emit('funding.received', funding),
  onMilestoneReached: (milestone, $) => $.call('celebrate', [milestone]),

  // Schedules
  everyWeek: ($) => $.call('updateMetrics', []),
  everyMonth: ($) => $.call('investorUpdate', []),
})

export const Founder = DO({
  $type: 'Founder',
  $version: 1,

  name: 'Full name',
  email: 'Email address',
  linkedin: 'LinkedIn profile URL',
  twitter: 'Twitter/X handle',

  role: 'CEO | CTO | COO | CPO | CFO | CMO | Cofounder',
  expertise: ['Areas of expertise'],

  background: {
    education: 'Educational background',
    experience: 'Relevant work experience',
    exits: 'Previous exits (number)',
  },

  insight: 'Unique market insight',
  motivation: 'Why building this startup',
  equity: 'Equity percentage (number)',

  startup: 'Startup founded <-Startup.founders',
})
