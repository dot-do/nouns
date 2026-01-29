/**
 * Stripe - Payment infrastructure
 *
 * Types for Stripe API entities.
 */

import { $, Noun } from '../../core/nouns'
import { Source } from './Source'

export const Stripe = Source({
  $type: 'Stripe',
  baseUrl: 'https://api.stripe.com/v1',
  authMethod: 'Bearer',
  docsUrl: 'https://stripe.com/docs/api',
})

export const StripeCustomer = Noun({
  $type: 'Stripe.Customer',
  $context: 'https://schema.org.ai',

  // Stripe fields
  id: 'Stripe customer ID',
  email: 'Customer email',
  name: 'Customer name',
  balance: 'Account balance in cents',
  currency: 'Default currency',
  delinquent: 'Is delinquent',
  created: 'Created timestamp',

  // Relationships
  subscriptions: $.Stripe.Subscription.where((s: any) => s.customer),
})

export const StripeSubscription = Noun({
  $type: 'Stripe.Subscription',
  $context: 'https://schema.org.ai',

  // Stripe fields
  id: 'Stripe subscription ID',
  status: 'active | past_due | canceled | trialing | paused',
  current_period_start: 'Current period start timestamp',
  current_period_end: 'Current period end timestamp',
  cancel_at_period_end: 'Will cancel at period end',
  trial_start: 'Trial start timestamp',
  trial_end: 'Trial end timestamp',

  // Relationships
  customer: $.Stripe.Customer,
  price: $.Stripe.Price,
})

export const StripeProduct = Noun({
  $type: 'Stripe.Product',
  $context: 'https://schema.org.ai',

  id: 'Stripe product ID',
  name: 'Product name',
  description: 'Product description',
  active: 'Is active',
  created: 'Created timestamp',

  // Relationships
  prices: $.Stripe.Price.where((p: any) => p.product),
})

export const StripePrice = Noun({
  $type: 'Stripe.Price',
  $context: 'https://schema.org.ai',

  id: 'Stripe price ID',
  unit_amount: 'Price in cents',
  currency: 'Currency',
  recurring: 'Recurring configuration',
  active: 'Is active',

  // Relationships
  product: $.Stripe.Product,
})

export const StripeAccount = Noun({
  $type: 'Stripe.Account',
  $context: 'https://schema.org.ai',

  id: 'Stripe account ID',
  business_type: 'individual | company',
  country: 'Account country',
  default_currency: 'Default currency',
  balance: 'Current balance',
})
