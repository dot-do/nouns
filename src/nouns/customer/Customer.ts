/**
 * Customer - Someone who pays for value
 *
 * A person who has a commercial relationship with a business.
 */

import { $ } from '../../core/nouns'
import { Person } from '../base/Person'

export const Customer = Person({
  $type: 'Customer',

  company: 'Company name',
  title: 'Job title',
  segment: 'Enterprise | SMB | Startup | Consumer',

  // Business relationship
  business: $.Business,

  // Stripe
  stripe: $.Stripe.Customer,
  balance: $.stripe.balance,
  delinquent: $.stripe.delinquent,

  // Relationships
  subscriptions: $.Subscription.where((s: any) => s.customer),
  invoices: $.Invoice.where((i: any) => i.customer),

  // Aggregated
  totalSpend: $.sum($.invoices.total),
  subscriptionCount: $.count($.subscriptions),
  lifetimeValue: $.sum($.invoices.total),

  // Computed
  isHealthy: ($: any) => !$.delinquent && $.balance >= 0,

  // Generated
  healthScore: 'Health score for {name} based on {totalSpend}, {subscriptionCount}',
})
