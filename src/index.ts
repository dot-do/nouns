/**
 * nouns.do - Business-as-Code
 *
 * Define businesses as code. Run them with AI.
 *
 * @example
 * ```typescript
 * import { $, Noun, Startup } from 'nouns.do'
 *
 * // Define a type
 * const MySaaS = SaaS({ $type: 'MySaaS', feature: 'Special feature' })
 *
 * // Create an instance
 * const myApp = new MySaaS({
 *   $id: 'https://my.app',
 *   name: 'My App',
 * })
 *
 * // Query at runtime ($ infers context from environment)
 * const startups = await $.Startup()
 * const headlessly = await $.Startup('headless.ly')
 * const products = await headlessly.products()
 * ```
 */

// =============================================================================
// CORE
// =============================================================================

// Noun factory and helpers
export { Noun, isType, isInstance, getType, getId } from './core/nouns.js'
export type { NounMeta, NounType } from './core/nouns.js'

// $ for schema definitions (re-exported from nouns)
export { $ } from './core/nouns.js'

// $Context for runtime queries
export { $Context, inferContext, setContext, getDefaultContext } from './core/context.js'
export type { Instance, Collection, ContextAPI } from './core/context.js'

// =============================================================================
// TYPES
// =============================================================================

export {
  // Base
  Thing,
  Person,
  Organization,

  // Business
  Business,
  Startup,
  Studio,

  // Product
  Product,
  SaaS,
  HeadlessSaaSType as HeadlessSaaS,
  API,
  SDK,
  App,

  // Agent & Service
  Agent,
  Service,
  ManagedService,

  // Customer
  Customer,
  Tenant,
  Investor,

  // Supporting
  Plan,
  Subscription,
  Task,
  Tool,

  // All types
  Types,
} from './core/types.js'

// =============================================================================
// INSTANCES
// =============================================================================

export {
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

  // Tenants
  AcmeTenant,
  WidgetsTenant,
  TechStartTenant,

  // Agents
  SalesAgent,
  SupportAgent,
  AnalyticsAgent,

  // APIs & SDKs
  CRMAPI,
  CRMTypeScriptSDK,
  CRMPythonSDK,

  // Plans
  CRMFreePlan,
  CRMProPlan,
  CRMEnterprisePlan,

  // Collections
  Businesses,
  Tenants,
  Agents,
  APIs,
  SDKs,
  Plans,
  Instances,
} from './core/businesses.js'

// =============================================================================
// EXTERNAL SOURCES
// =============================================================================

export {
  Source,
  Stripe,
  StripeCustomer,
  StripeSubscription,
  StripeProduct,
  StripePrice,
  StripeAccount,
  Github,
  GithubRepo,
  GithubUser,
  GithubOrganization,
  Google,
  GoogleCampaign,
  Vercel,
  VercelDeployment,
  VercelProject,
  NPM,
  NPMPackage,
  DNS,
  DNSRecord,
  Analytics,
  AnalyticsPage,
  Sources,
} from './core/sources.js'
