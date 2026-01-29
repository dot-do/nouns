import { DO } from './do/do'

export const Market = DO({
  $type: 'Market',
  $version: 1,

  // Identity
  name: 'Market name',
  description: 'Market description',

  // Size
  tam: 'Total addressable market USD (number)',
  sam: 'Serviceable addressable market USD (number)',
  som: 'Serviceable obtainable market USD (number)',
  cagr: 'Compound annual growth rate (number)',

  // Characteristics
  maturity: 'Emerging | Growing | Mature | Declining',
  competition: 'Fragmented | Consolidating | Oligopoly | Monopoly',
  barriers: ['Barriers to entry'],
  trends: ['Market trends'],

  // Geography
  regions: ['Geographic regions'],
  primary: 'Primary region',

  // Relationships
  industries: ['Related industries ~>Industry'],
  segments: ['Market segments ->MarketSegment'],
  players: ['Companies in market ->Business'],
  startups: ['<- Startup.market'],

  // Generated
  analysis: { mdx: 'Generate market analysis for {name}' },
  forecast: { mdx: 'Generate 5-year forecast for {name}' },
})

export const Industry = DO({
  $type: 'Industry',
  $version: 1,

  // Classification
  naics: 'NAICS code',
  title: 'Industry title',
  description: 'Industry description',

  // Structure
  sectors: ['Industry sectors'],
  valueChain: ['Value chain stages'],

  // Economics
  size: 'Industry size USD (number)',
  growth: 'Annual growth rate (number)',
  profitMargin: 'Average profit margin (number)',

  // Competitive landscape
  majorPlayers: ['Leading companies ~>Business'],
  concentration: 'Fragmented | Moderate | Concentrated',
  disruptors: ['Disruptive startups ~>Startup'],

  // Trends
  trends: ['Industry trends'],
  threats: ['Industry threats'],
  opportunities: ['Growth opportunities'],

  // Relationships
  upstream: ['Upstream industries ~>Industry'],
  downstream: ['Downstream industries ~>Industry'],
  adjacent: ['Adjacent industries ~>Industry'],
  occupations: ['Related occupations ~>Occupation'],

  // Generated
  overview: { mdx: 'Generate industry overview for {title}' },
  outlook: { mdx: 'Generate outlook report for {title}' },
})

export const IdealCustomerProfile = DO({
  $type: 'IdealCustomerProfile',
  $version: 1,

  // Who they are
  as: 'Role or job title <~Occupation',
  at: 'Type of company <~Industry',
  are: 'What they do <~Activity',
  using: 'Tools they use <~Tool',
  to: 'Goal they want to achieve <~Outcome',

  // Demographics
  demographics: {
    age: 'Age range',
    experience: 'Years of experience',
    education: 'Education level',
    location: 'Geographic location',
  },

  // Company fit
  company: {
    size: 'Company size range',
    revenue: 'Revenue range',
    industry: 'Target industry',
    stage: 'Company stage',
  },

  // Psychographics
  wants: 'What they want but do not strictly need',
  needs: 'What they consider essential',
  desires: 'What they aspire to achieve',
  fears: 'What negative outcomes they avoid',

  // Pain points
  painPoints: ['Current frustrations'],
  goals: ['What they want to achieve'],
  objections: ['Common objections to purchasing'],

  // Behavior
  buyingProcess: 'How they make purchase decisions',
  channels: ['Where they spend time online'],
  influencers: ['Who influences their decisions'],

  // Value
  ltv: 'Expected lifetime value (number)',
  cac: 'Cost to acquire (number)',
  willingness: 'Willingness to pay (number)',

  // Sentence
  sentence: (icp) => `${icp.as} at ${icp.at} are ${icp.are} using ${icp.using} to ${icp.to}`,

  // Generated
  persona: { mdx: 'Generate detailed persona for {as} at {at}' },
  messaging: { mdx: 'Generate messaging for {as} with pain points {painPoints}' },
})

export const Occupation = DO({
  $type: 'Occupation',
  $version: 1,

  // Classification
  onetCode: 'O*NET-SOC code',
  title: 'Job title',
  description: 'Role description',

  // Responsibilities
  primaryTasks: ['Primary job tasks'],
  secondaryTasks: ['Secondary tasks'],
  decisions: ['Decisions they make'],
  deliverables: ['What they produce'],

  // Relationships
  reportsTo: ['Roles they report to ~>Occupation'],
  manages: ['Roles they manage ~>Occupation'],
  collaborates: ['Roles they work with ~>Occupation'],
  serves: ['Internal/external customers'],

  // Tools & Systems
  tools: ['Tools used ~>Tool'],
  software: ['Software used ~>App'],
  dataAccessed: ['Data they work with'],

  // Pain points (key for product)
  dailyFrustrations: ['Daily frustrations'],
  timeWasters: ['What wastes their time'],
  skillGaps: ['Missing skills'],
  informationGaps: ['Missing information'],
  painPoints: ['Key pain points'],
  wishes: ['What they wish they could do'],
  fears: ['Professional fears'],
  motivations: ['What motivates them'],

  // Generated
  dayInLife: { mdx: 'Describe a day in the life of {title}' },
  automationOpportunities: { mdx: 'Identify automation opportunities for {title}' },
})
