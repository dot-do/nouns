/**
 * Instances - Creating things from Nouns
 *
 * Nouns define types/classes.
 * Instances are actual things with $id identity.
 *
 * Pattern:
 *   Startup({ $type: 'SaasStartup', ... })  → defines a new type
 *   Startup({ $id: 'https://...', ... })    → creates an instance
 */

import { $, Noun, NounType, Business, Startup, Product, Customer, Person } from './nouns.js'

// =============================================================================
// INSTANCE TYPE
// =============================================================================

export interface Instance<T = any> {
  $id: string
  $type: string
  $noun: NounType<any>
  [key: string]: any
}

// =============================================================================
// STARTUPS.STUDIO - A Startup Studio
// =============================================================================

export const StartupsStudio = new Startup({
  $id: 'https://startups.studio',
  name: 'Startups.Studio',
  description: 'A startup studio building autonomous businesses',
  vertical: 'Venture Studio',
  stage: 'Growth',

  // Generated
  pitch: 'We build startups that run themselves',
})

// =============================================================================
// HEADLESS.LY - Headless SaaS for AI, not Humans
// =============================================================================

/**
 * HeadlessSaaS - A type of SaaS product designed for AI consumers
 */
export const HeadlessSaaS = Product({
  $type: 'HeadlessSaaS',

  // No UI - API-first for AI agents
  hasUI: false,
  apiFirst: true,
  consumers: 'AI agents, not humans',

  // Generated
  tagline: 'SaaS for AI, not humans',
})

/**
 * Headless.ly - The company
 */
export const HeadlessLy = new Startup({
  $id: 'https://headless.ly',
  name: 'Headless.ly',
  description: 'Headless SaaS for AI, not Humans',
  vertical: 'AI Infrastructure',
  stage: 'Seed',

  // Mission
  mission: 'Build SaaS products that AI agents consume directly',

  // Generated
  pitch: 'Every SaaS will have an AI-first API. We build them.',
  whyNow: 'AI agents are becoming the primary software consumers',
})

// =============================================================================
// CRM.HEADLESS.LY - A Headless CRM Product
// =============================================================================

/**
 * HeadlessCRM - The CRM product type
 */
export const HeadlessCRM = HeadlessSaaS({
  $type: 'HeadlessCRM',

  // CRM-specific
  features: [
    'Contact management via API',
    'Deal pipeline for agents',
    'Activity tracking',
    'AI-native integrations',
  ],

  // Generated
  tagline: 'CRM that AI agents actually use',
})

/**
 * CRM.Headless.ly - The CRM product instance
 */
export const CRMHeadlessLy = new HeadlessCRM({
  $id: 'https://crm.headless.ly',
  name: 'Headless CRM',
  description: 'A CRM designed for AI agents to manage customer relationships',

  // Pricing
  plans: [
    { name: 'Starter', price: 0, limits: { contacts: 1000, apiCalls: 10000 } },
    { name: 'Pro', price: 4900, limits: { contacts: 10000, apiCalls: 100000 } },
    { name: 'Enterprise', price: 'custom', limits: { contacts: 'unlimited', apiCalls: 'unlimited' } },
  ],

  // API
  apiBase: 'https://api.crm.headless.ly',
  apiDocs: 'https://docs.crm.headless.ly',

  // Product relationship
  business: HeadlessLy,
})

// =============================================================================
// TENANT INSTANCES - Customers using the CRM
// =============================================================================

/**
 * Tenant - A customer instance of a multi-tenant SaaS
 */
export const Tenant = Customer({
  $type: 'Tenant',

  // Multi-tenancy
  subdomain: 'Tenant subdomain',
  plan: 'Current plan',

  // Usage
  usage: 'Current usage metrics',

  // Computed
  usagePercent: ($: any) => $.usage / $.plan.limits * 100,
})

/**
 * Acme - A tenant of Headless CRM
 */
export const AcmeTenant = new Tenant({
  $id: 'https://crm.headless.ly/acme',
  name: 'Acme Corp',
  email: 'admin@acme.com',
  company: 'Acme Corporation',
  subdomain: 'acme',

  // Their plan
  plan: 'Pro',

  // Their product
  product: CRMHeadlessLy,
})

/**
 * Widgets Inc - Another tenant
 */
export const WidgetsTenant = new Tenant({
  $id: 'https://crm.headless.ly/widgets',
  name: 'Widgets Inc',
  email: 'admin@widgets.io',
  company: 'Widgets Incorporated',
  subdomain: 'widgets',

  plan: 'Enterprise',
  product: CRMHeadlessLy,
})

// =============================================================================
// MORE HEADLESS PRODUCTS
// =============================================================================

/**
 * Email.Headless.ly - Headless Email Marketing
 */
export const EmailHeadlessLy = new HeadlessSaaS({
  $id: 'https://email.headless.ly',
  name: 'Headless Email',
  description: 'Email marketing for AI agents',

  features: [
    'Campaign management API',
    'Template rendering',
    'Analytics & tracking',
    'AI-generated content',
  ],

  business: HeadlessLy,
})

/**
 * Analytics.Headless.ly - Headless Analytics
 */
export const AnalyticsHeadlessLy = new HeadlessSaaS({
  $id: 'https://analytics.headless.ly',
  name: 'Headless Analytics',
  description: 'Analytics for AI-driven products',

  features: [
    'Event tracking API',
    'Real-time dashboards (for humans to audit)',
    'AI-readable reports',
    'Anomaly detection',
  ],

  business: HeadlessLy,
})

// =============================================================================
// EXPORT
// =============================================================================

export const Instances = {
  // Studio
  StartupsStudio,

  // Headless.ly ecosystem
  HeadlessLy,
  CRMHeadlessLy,
  EmailHeadlessLy,
  AnalyticsHeadlessLy,

  // Tenants
  AcmeTenant,
  WidgetsTenant,
}

export const Types = {
  HeadlessSaaS,
  HeadlessCRM,
  Tenant,
}

// =============================================================================
// TEST
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('=== Instances vs Types ===\n')

  console.log('TYPES (have $type, define schemas):')
  console.log('  HeadlessSaaS.$meta.type:', HeadlessSaaS.$meta.type)
  console.log('  HeadlessCRM.$meta.type:', HeadlessCRM.$meta.type)
  console.log('  HeadlessCRM extends:', HeadlessCRM.$meta.extends)
  console.log('  Tenant.$meta.type:', Tenant.$meta.type)

  console.log('')
  console.log('INSTANCES (have $id, are actual things):')
  console.log('  HeadlessLy.$id:', (HeadlessLy as any).$id)
  console.log('  CRMHeadlessLy.$id:', (CRMHeadlessLy as any).$id)
  console.log('  AcmeTenant.$id:', (AcmeTenant as any).$id)
  console.log('  WidgetsTenant.$id:', (WidgetsTenant as any).$id)

  console.log('')
  console.log('HIERARCHY:')
  console.log('  Startups.Studio')
  console.log('    └─ Headless.ly (startup)')
  console.log('         ├─ crm.headless.ly (product)')
  console.log('         │    ├─ /acme (tenant)')
  console.log('         │    └─ /widgets (tenant)')
  console.log('         ├─ email.headless.ly (product)')
  console.log('         └─ analytics.headless.ly (product)')
}
