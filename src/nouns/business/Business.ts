/**
 * Business - An organization that creates, delivers, and captures value
 *
 * The core abstraction for any value-creating entity.
 */

import { $ } from '../../core/nouns'
import { Organization } from '../base/Organization'

export const Business = Organization({
  $type: 'Business',

  stage: 'Idea | Validation | Growth | Scale | Mature',
  industry: 'Industry vertical',
  businessModel: 'B2B | B2C | B2B2C | Marketplace | Platform',

  // External integrations
  stripe: $.Stripe.Account,
  github: $.Github.Organization,

  // Revenue (synced from Stripe)
  stripeBalance: $.stripe.balance,
  mrr: $.sum($.subscriptions.amount),
  arr: ($: any) => $.mrr * 12,

  // Relationships
  products: $.Product.where((p: any) => p.business),
  customers: $.Customer.where((c: any) => c.business),
  subscriptions: $.Subscription.where((s: any) => s.business),

  // Aggregated
  customerCount: $.count($.customers),
  productCount: $.count($.products),

  // Generated
  positioning: 'Positioning statement for {name} in {industry}',
  valueProposition: 'Value proposition for {name}',
})
