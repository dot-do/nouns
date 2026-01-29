/**
 * Tenant - A customer instance in a multi-tenant SaaS
 *
 * Represents a customer's isolated environment within a SaaS product.
 */

import { $ } from '../../core/nouns'
import { Customer } from './Customer'

export const Tenant = Customer({
  $type: 'Tenant',

  // Multi-tenancy
  subdomain: 'Tenant subdomain',
  customDomain: 'Custom domain if any',

  // Product
  product: $.SaaS,
  plan: $.Plan,

  // Usage
  usage: 'Current usage metrics',
  usagePercent: ($: any) => $.usage && $.plan?.limits ? $.usage / $.plan.limits * 100 : 0,

  // Data
  dataRegion: 'Data storage region',
  dataRetention: 'Data retention policy',
})
