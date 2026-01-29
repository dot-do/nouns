/**
 * Real Business Instances
 *
 * Comprehensive examples of Business-as-Code
 */

import {
  Thing, Person, Organization,
  Business, Startup, Studio,
  Product, SaaS, HeadlessSaaSType, API, SDK, App,
  Agent, Service, ManagedService,
  Customer, Tenant, Investor,
  Plan, Subscription, Task, Tool,
} from './types.js'

// =============================================================================
// STARTUPS.STUDIO - The Venture Studio
// =============================================================================

export const StartupsStudio = new Studio({
  $id: 'https://startups.studio',
  name: 'Startups.Studio',
  slug: 'startups-studio',
  description: 'A venture studio building autonomous AI-native startups',
  tagline: 'We build startups that run themselves',

  domain: 'startups.studio',
  foundingDate: '2024-01-01',
  location: 'San Francisco, CA',

  focus: 'AI-native SaaS and autonomous business infrastructure',
  model: 'Venture Studio',
  industry: 'Technology',
  businessModel: 'Platform',
  stage: 'Growth',

  // Generated
  thesis: 'Building the infrastructure for autonomous businesses',
})

// =============================================================================
// .DO ECOSYSTEM - Core Infrastructure
// =============================================================================

/**
 * APIs.do - API Gateway & Management
 */
export const APIsDo = new SaaS({
  $id: 'https://apis.do',
  name: 'APIs.do',
  slug: 'apis-do',
  description: 'Unified API gateway for AI agents',
  tagline: 'One API to rule them all',

  domain: 'apis.do',
  type: 'SaaS',
  status: 'Live',

  business: StartupsStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
  apiFirst: true,
})

/**
 * Agents.do - Agent Management Platform
 */
export const AgentsDo = new SaaS({
  $id: 'https://agents.do',
  name: 'Agents.do',
  slug: 'agents-do',
  description: 'Platform for building, deploying, and managing AI agents',
  tagline: 'Deploy agents that work',

  domain: 'agents.do',
  type: 'SaaS',
  status: 'Live',

  business: StartupsStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
})

/**
 * Functions.do - Serverless Functions for AI
 */
export const FunctionsDo = new SaaS({
  $id: 'https://functions.do',
  name: 'Functions.do',
  slug: 'functions-do',
  description: 'Serverless functions optimized for AI workloads',
  tagline: 'Functions that think',

  domain: 'functions.do',
  type: 'SaaS',
  status: 'Live',

  business: StartupsStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
})

/**
 * Workflows.do - Workflow Orchestration
 */
export const WorkflowsDo = new SaaS({
  $id: 'https://workflows.do',
  name: 'Workflows.do',
  slug: 'workflows-do',
  description: 'Orchestrate complex AI workflows with ease',
  tagline: 'Workflows that flow',

  domain: 'workflows.do',
  type: 'SaaS',
  status: 'Live',

  business: StartupsStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
})

/**
 * LLM.do - LLM Gateway
 */
export const LLMDo = new SaaS({
  $id: 'https://llm.do',
  name: 'LLM.do',
  slug: 'llm-do',
  description: 'Unified gateway to all LLM providers',
  tagline: 'One API for all LLMs',

  domain: 'llm.do',
  type: 'SaaS',
  status: 'Live',

  business: StartupsStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
})

/**
 * Database.do - AI-Native Database
 */
export const DatabaseDo = new SaaS({
  $id: 'https://database.do',
  name: 'Database.do',
  slug: 'database-do',
  description: 'Database designed for AI applications',
  tagline: 'Data that understands',

  domain: 'database.do',
  type: 'SaaS',
  status: 'Live',

  business: StartupsStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
})

/**
 * Nouns.do - Business-as-Code Platform
 */
export const NounsDo = new SaaS({
  $id: 'https://nouns.do',
  name: 'Nouns.do',
  slug: 'nouns-do',
  description: 'Define businesses as code, run them with AI',
  tagline: 'Business-as-Code',

  domain: 'nouns.do',
  type: 'SaaS',
  status: 'Live',

  business: StartupsStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
})

// =============================================================================
// SAAS.STUDIO - SaaS Building Platform
// =============================================================================

export const SaaSStudio = new Startup({
  $id: 'https://saas.studio',
  name: 'SaaS.Studio',
  slug: 'saas-studio',
  description: 'Build SaaS products in days, not months',
  tagline: 'Ship SaaS faster',

  domain: 'saas.studio',
  foundingDate: '2024-06-01',
  location: 'San Francisco, CA',

  vertical: 'Developer Tools',
  stage: 'Seed',
  industry: 'Technology',
  businessModel: 'B2B',

  // Generated
  pitch: 'We help developers build and ship SaaS products 10x faster',
})

/**
 * SaaS.Dev - Development Tools
 */
export const SaaSDev = new SaaS({
  $id: 'https://saas.dev',
  name: 'SaaS.Dev',
  slug: 'saas-dev',
  description: 'Development environment for SaaS builders',
  tagline: 'Build SaaS like a pro',

  domain: 'saas.dev',
  type: 'SaaS',
  status: 'Live',

  business: SaaSStudio,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
})

// =============================================================================
// HEADLESS.LY - Headless SaaS for AI
// =============================================================================

export const HeadlessLy = new Startup({
  $id: 'https://headless.ly',
  name: 'Headless.ly',
  slug: 'headless-ly',
  description: 'Headless SaaS for AI, not humans',
  tagline: 'SaaS for AI agents',

  domain: 'headless.ly',
  foundingDate: '2024-03-01',
  location: 'San Francisco, CA',

  vertical: 'AI Infrastructure',
  stage: 'Seed',
  industry: 'Technology',
  businessModel: 'B2B',

  // Generated
  pitch: 'Every SaaS will have an AI-first API. We build them.',
  whyNow: 'AI agents are becoming the primary software consumers',
})

/**
 * CRM.Headless.ly - Headless CRM
 */
export const CRMHeadlessLy = new HeadlessSaaSType({
  $id: 'https://crm.headless.ly',
  name: 'Headless CRM',
  slug: 'headless-crm',
  description: 'CRM designed for AI agents to manage customer relationships',
  tagline: 'CRM that AI agents actually use',

  domain: 'crm.headless.ly',
  type: 'SaaS',
  status: 'Live',

  business: HeadlessLy,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
  apiFirst: true,
  hasUI: false,

  apiBase: 'https://api.crm.headless.ly',
  apiDocs: 'https://docs.crm.headless.ly',
})

/**
 * Email.Headless.ly - Headless Email
 */
export const EmailHeadlessLy = new HeadlessSaaSType({
  $id: 'https://email.headless.ly',
  name: 'Headless Email',
  slug: 'headless-email',
  description: 'Email marketing for AI agents',
  tagline: 'Email campaigns that run themselves',

  domain: 'email.headless.ly',
  type: 'SaaS',
  status: 'Live',

  business: HeadlessLy,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
  apiFirst: true,
  hasUI: false,

  apiBase: 'https://api.email.headless.ly',
  apiDocs: 'https://docs.email.headless.ly',
})

/**
 * Analytics.Headless.ly - Headless Analytics
 */
export const AnalyticsHeadlessLy = new HeadlessSaaSType({
  $id: 'https://analytics.headless.ly',
  name: 'Headless Analytics',
  slug: 'headless-analytics',
  description: 'Analytics for AI-driven products',
  tagline: 'Insights AI can understand',

  domain: 'analytics.headless.ly',
  type: 'SaaS',
  status: 'Live',

  business: HeadlessLy,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
  apiFirst: true,
  hasUI: false,

  apiBase: 'https://api.analytics.headless.ly',
  apiDocs: 'https://docs.analytics.headless.ly',
})

/**
 * Billing.Headless.ly - Headless Billing
 */
export const BillingHeadlessLy = new HeadlessSaaSType({
  $id: 'https://billing.headless.ly',
  name: 'Headless Billing',
  slug: 'headless-billing',
  description: 'Billing and subscription management for AI',
  tagline: 'Billing that bills itself',

  domain: 'billing.headless.ly',
  type: 'SaaS',
  status: 'Live',

  business: HeadlessLy,

  multiTenant: true,
  selfServe: true,
  freeTier: true,
  apiFirst: true,
  hasUI: false,

  apiBase: 'https://api.billing.headless.ly',
  apiDocs: 'https://docs.billing.headless.ly',
})

// =============================================================================
// API.MANAGEMENT - API Management Platform
// =============================================================================

export const APIManagement = new Startup({
  $id: 'https://api.management',
  name: 'API.Management',
  slug: 'api-management',
  description: 'Complete API lifecycle management',
  tagline: 'APIs managed right',

  domain: 'api.management',
  foundingDate: '2024-02-01',
  location: 'San Francisco, CA',

  vertical: 'Developer Tools',
  stage: 'Seed',
  industry: 'Technology',
  businessModel: 'B2B',
})

// =============================================================================
// AGENTS.MANAGEMENT - Agent Management Platform
// =============================================================================

export const AgentsManagement = new Startup({
  $id: 'https://agents.management',
  name: 'Agents.Management',
  slug: 'agents-management',
  description: 'Enterprise agent orchestration and governance',
  tagline: 'Agents under control',

  domain: 'agents.management',
  foundingDate: '2024-04-01',
  location: 'San Francisco, CA',

  vertical: 'AI Infrastructure',
  stage: 'Seed',
  industry: 'Technology',
  businessModel: 'B2B',
})

// =============================================================================
// TENANTS / CUSTOMERS
// =============================================================================

/**
 * Acme Corp - A tenant of Headless CRM
 */
export const AcmeTenant = new Tenant({
  $id: 'https://crm.headless.ly/acme',
  name: 'Acme Corp',
  slug: 'acme',
  email: 'admin@acme.com',
  company: 'Acme Corporation',

  subdomain: 'acme',
  product: CRMHeadlessLy,
})

/**
 * Widgets Inc - Another tenant
 */
export const WidgetsTenant = new Tenant({
  $id: 'https://crm.headless.ly/widgets',
  name: 'Widgets Inc',
  slug: 'widgets',
  email: 'admin@widgets.io',
  company: 'Widgets Incorporated',

  subdomain: 'widgets',
  product: CRMHeadlessLy,
})

/**
 * TechStart - A startup using the platform
 */
export const TechStartTenant = new Tenant({
  $id: 'https://crm.headless.ly/techstart',
  name: 'TechStart',
  slug: 'techstart',
  email: 'founder@techstart.io',
  company: 'TechStart Inc',

  subdomain: 'techstart',
  product: CRMHeadlessLy,
})

// =============================================================================
// AGENTS
// =============================================================================

/**
 * Sales Agent for CRM
 */
export const SalesAgent = new Agent({
  $id: 'https://crm.headless.ly/agents/sales',
  name: 'Sales Agent',
  slug: 'sales-agent',
  description: 'AI agent that handles sales outreach and follow-ups',

  role: 'Sales Development Representative',
  model: 'claude-3-5-sonnet',
  autonomyLevel: 'Supervised',

  business: HeadlessLy,
})

/**
 * Support Agent
 */
export const SupportAgent = new Agent({
  $id: 'https://crm.headless.ly/agents/support',
  name: 'Support Agent',
  slug: 'support-agent',
  description: 'AI agent that handles customer support tickets',

  role: 'Customer Support Specialist',
  model: 'claude-3-5-sonnet',
  autonomyLevel: 'Full',

  business: HeadlessLy,
})

/**
 * Analytics Agent
 */
export const AnalyticsAgent = new Agent({
  $id: 'https://analytics.headless.ly/agents/analyst',
  name: 'Analytics Agent',
  slug: 'analytics-agent',
  description: 'AI agent that analyzes data and generates insights',

  role: 'Data Analyst',
  model: 'claude-3-opus',
  autonomyLevel: 'Supervised',

  business: HeadlessLy,
})

// =============================================================================
// APIS & SDKS
// =============================================================================

/**
 * CRM API
 */
export const CRMAPI = new API({
  $id: 'https://api.crm.headless.ly',
  name: 'Headless CRM API',
  slug: 'crm-api',
  description: 'RESTful API for Headless CRM',

  version: 'v1',
  baseUrl: 'https://api.crm.headless.ly/v1',
  docsUrl: 'https://docs.crm.headless.ly',
  openApiSpec: 'https://api.crm.headless.ly/openapi.json',

  authMethod: 'Bearer',
  rateLimit: '1000',

  business: HeadlessLy,
})

/**
 * CRM TypeScript SDK
 */
export const CRMTypeScriptSDK = new SDK({
  $id: 'https://crm.headless.ly/sdk/typescript',
  name: 'Headless CRM TypeScript SDK',
  slug: 'crm-sdk-ts',
  description: 'TypeScript SDK for Headless CRM',

  language: 'TypeScript',
  runtime: 'Node',
  packageName: '@headless/crm',
  packageManager: 'npm',
  version: '1.0.0',

  api: CRMAPI,
  product: CRMHeadlessLy,
  business: HeadlessLy,
})

/**
 * CRM Python SDK
 */
export const CRMPythonSDK = new SDK({
  $id: 'https://crm.headless.ly/sdk/python',
  name: 'Headless CRM Python SDK',
  slug: 'crm-sdk-py',
  description: 'Python SDK for Headless CRM',

  language: 'Python',
  packageName: 'headless-crm',
  packageManager: 'pip',
  version: '1.0.0',

  api: CRMAPI,
  product: CRMHeadlessLy,
  business: HeadlessLy,
})

// =============================================================================
// PLANS
// =============================================================================

/**
 * CRM Free Plan
 */
export const CRMFreePlan = new Plan({
  $id: 'https://crm.headless.ly/plans/free',
  name: 'Free',
  slug: 'free',
  description: 'Free tier for small teams',

  price: 0,
  interval: 'month',
  currency: 'USD',

  limits: JSON.stringify({ contacts: 1000, apiCalls: 10000 }),
  features: JSON.stringify(['Basic CRM', 'API Access', 'Email Support']),

  product: CRMHeadlessLy,
})

/**
 * CRM Pro Plan
 */
export const CRMProPlan = new Plan({
  $id: 'https://crm.headless.ly/plans/pro',
  name: 'Pro',
  slug: 'pro',
  description: 'For growing teams',

  price: 4900, // $49/mo
  interval: 'month',
  currency: 'USD',

  limits: JSON.stringify({ contacts: 10000, apiCalls: 100000 }),
  features: JSON.stringify(['Advanced CRM', 'API Access', 'Priority Support', 'Integrations']),

  product: CRMHeadlessLy,
})

/**
 * CRM Enterprise Plan
 */
export const CRMEnterprisePlan = new Plan({
  $id: 'https://crm.headless.ly/plans/enterprise',
  name: 'Enterprise',
  slug: 'enterprise',
  description: 'For large organizations',

  price: 49900, // $499/mo
  interval: 'month',
  currency: 'USD',

  limits: JSON.stringify({ contacts: 'unlimited', apiCalls: 'unlimited' }),
  features: JSON.stringify(['Enterprise CRM', 'API Access', 'Dedicated Support', 'Custom Integrations', 'SLA']),

  product: CRMHeadlessLy,
})

// =============================================================================
// EXPORT ALL INSTANCES
// =============================================================================

export const Businesses = {
  // Studios
  StartupsStudio,

  // .do Ecosystem
  APIsDo,
  AgentsDo,
  FunctionsDo,
  WorkflowsDo,
  LLMDo,
  DatabaseDo,
  NounsDo,

  // SaaS.Studio
  SaaSStudio,
  SaaSDev,

  // Headless.ly
  HeadlessLy,
  CRMHeadlessLy,
  EmailHeadlessLy,
  AnalyticsHeadlessLy,
  BillingHeadlessLy,

  // Management
  APIManagement,
  AgentsManagement,
}

export const Tenants = {
  AcmeTenant,
  WidgetsTenant,
  TechStartTenant,
}

export const Agents = {
  SalesAgent,
  SupportAgent,
  AnalyticsAgent,
}

export const APIs = {
  CRMAPI,
}

export const SDKs = {
  CRMTypeScriptSDK,
  CRMPythonSDK,
}

export const Plans = {
  CRMFreePlan,
  CRMProPlan,
  CRMEnterprisePlan,
}

// All instances
export const Instances = {
  ...Businesses,
  ...Tenants,
  ...Agents,
  ...APIs,
  ...SDKs,
  ...Plans,
}
