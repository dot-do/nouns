/**
 * SaaS - Software as a Service
 *
 * A product delivered as a hosted service with subscription pricing.
 */

import { $ } from '../../core/nouns'
import { Product } from './Product'

export const SaaS = Product({
  $type: 'SaaS',

  productKind: 'SaaS',

  // SaaS-specific
  multiTenant: 'Whether multi-tenant',
  selfServe: 'Whether self-serve signup',
  freeTier: 'Whether has free tier',

  // Tenants
  tenants: $.Tenant.where((t: any) => t.product),
  tenantCount: $.count($.tenants),

  // Metrics
  dau: 'Daily active users',
  mau: 'Monthly active users',
  churnRate: 'Monthly churn rate',
  nrr: 'Net revenue retention',
  ltv: 'Customer lifetime value',
  cac: 'Customer acquisition cost',
  ltvCacRatio: ($: any) => $.ltv && $.cac ? $.ltv / $.cac : null,

  // Generated
  idealCustomer: 'Ideal customer profile for {name}',
})
