/**
 * Subscription - An ongoing customer relationship
 *
 * Represents a customer's recurring payment for a product/service.
 */

import { $, Noun } from '../../core/nouns'

export const Subscription = Noun({
  $type: 'Subscription',
  $context: 'https://schema.org.ai',

  // Relationships
  customer: $.Customer,
  product: $.Product,
  plan: $.Plan,
  business: $.Business,

  // Stripe
  stripe: $.Stripe.Subscription,
  status: $.stripe.status,
  currentPeriodEnd: $.stripe.current_period_end,
  cancelAtPeriodEnd: $.stripe.cancel_at_period_end,

  // Our data
  startedAt: 'When subscription started',
  trialEndsAt: 'When trial ends',

  // Computed
  isActive: ($: any) => $.status === 'active' || $.status === 'trialing',
  isTrialing: ($: any) => $.status === 'trialing',
  amount: ($: any) => $.plan?.price || 0,
  daysRemaining: ($: any) => $.currentPeriodEnd ? Math.ceil(($.currentPeriodEnd * 1000 - Date.now()) / 86400000) : 0,
})
