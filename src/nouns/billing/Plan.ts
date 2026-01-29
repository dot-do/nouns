/**
 * Plan - A pricing tier
 *
 * Defines what customers get at a specific price point.
 */

import { $, Noun } from '../../core/nouns'

export const Plan = Noun({
  $type: 'Plan',
  $context: 'https://schema.org.ai',

  // Identity
  name: 'Plan name',
  description: 'Plan description',
  slug: 'URL-safe identifier',

  // Pricing
  price: 'Monthly price in cents',
  interval: 'month | year',
  currency: 'USD | EUR | GBP',

  // Limits
  limits: 'Usage limits',
  features: 'Included features',

  // Product/Service
  product: $.Product,
  service: $.Service,

  // Stripe
  stripePrice: $.Stripe.Price,

  // Subscribers
  subscriptions: $.Subscription.where((s: any) => s.plan),
  subscriberCount: $.count($.subscriptions),
  revenue: ($: any) => $.subscriberCount * $.price,
})
