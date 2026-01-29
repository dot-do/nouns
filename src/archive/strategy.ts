import { DO } from './do/do'

export const LeanCanvas = DO({
  $type: 'LeanCanvas',
  $version: 1,

  // Problem side
  problems: ['Top 3 problems to solve'],
  existingSolutions: ['How customers solve this today'],
  customerSegments: ['Target customer segments'],

  // Solution side
  solution: ['Top 3 features of solution'],
  uniqueValueProposition: 'Single compelling message',
  highLevelConcept: 'X for Y analogy',
  unfairAdvantage: 'Cannot be easily copied',

  // Channels & Metrics
  channels: ['Path to customers'],
  keyMetrics: ['Key numbers to measure'],

  // Economics
  costStructure: ['Fixed and variable costs'],
  revenueStreams: ['Revenue model'],

  // Relationships
  startup: 'Related startup <-Startup.businessModel',
  idea: 'Related idea <-Idea',

  // Generated
  validate: { mdx: 'Generate validation experiments for {problems}' },
  pivot: { mdx: 'Suggest pivot options based on {customerSegments}' },
})

export const StoryBrand = DO({
  $type: 'StoryBrand',
  $version: 1,

  // The Hero (Customer)
  character: {
    description: 'Who is the hero',
    want: 'What do they want',
    need: 'What do they actually need',
  },

  // The Problem
  problem: {
    external: 'Surface-level problem',
    internal: 'How it makes them feel',
    philosophical: 'Why this is wrong',
    villain: 'What/who to blame',
  },

  // The Guide (Your Brand)
  guide: {
    empathy: 'We understand your problem',
    authority: 'We can help because...',
  },

  // The Plan
  plan: {
    step1: 'First step to take',
    step2: 'Second step',
    step3: 'Third step',
  },

  // Call to Action
  callToAction: {
    direct: 'Primary CTA',
    transitional: 'Softer CTA',
  },

  // Stakes
  stakes: {
    failure: 'What happens if they do not act',
    success: 'What transformation they achieve',
  },

  // Relationships
  startup: 'Related startup <-Startup.storyBrand',
  brand: 'Related brand <-Brand',

  // Generated
  script: { mdx: 'Generate brand script using StoryBrand for {character}' },
  email: { mdx: 'Generate email sequence using StoryBrand framework' },
})

export const Differentiation = DO({
  $type: 'Differentiation',
  $version: 1,

  // Positioning
  category: 'Market category',
  frame: 'Frame of reference',

  // Differentiation vectors
  vectors: [{
    dimension: 'What dimension',
    position: 'Where positioned',
    proof: 'Evidence of position',
  }],

  // Competition
  competitors: ['Key competitors ~>Business'],
  alternatives: ['Alternative solutions'],

  // Advantages
  sustainable: ['Sustainable advantages'],
  temporary: ['Temporary advantages'],
  moat: 'Competitive moat type',

  // Generated
  positioning: { mdx: 'Generate positioning statement vs {competitors}' },
  battleCard: { mdx: 'Generate competitive battle card for {competitors}' },
})
