/**
 * Product - Something a business sells
 *
 * The base type for all product offerings.
 */

import { $ } from '../../core/nouns'
import { Thing } from '../base/Thing'

export const Product = Thing({
  $type: 'Product',

  tagline: 'Short tagline',
  productKind: 'SaaS | API | SDK | App | Service | Platform',
  status: 'Development | Beta | Live | Sunset | Deprecated',

  // Business
  business: $.Business,

  // Code
  repo: $.Github.Repo,
  stars: $.repo.stargazers_count,
  forks: $.repo.forks_count,

  // Pricing
  plans: $.Plan.where((p: any) => p.product),

  // Metrics
  subscriptions: $.Subscription.where((s: any) => s.product),
  activeSubscriptions: $.count($.subscriptions),
  mrr: $.sum($.subscriptions.amount),
  arr: ($: any) => $.mrr * 12,

  // Generated
  positioning: 'Positioning for {name}: {tagline}',
})
