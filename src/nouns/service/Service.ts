/**
 * Service - A managed offering
 *
 * Something that is operated on behalf of customers.
 */

import { $, Noun } from '../../core/nouns'
import { Thing } from '../base/Thing'

export const Service = Thing({
  $type: 'Service',

  // Service definition
  deploymentType: 'Managed | Self-Hosted | Serverless | Edge',
  category: 'Infrastructure | Platform | Application',

  // Business
  business: $.Business,

  // Pricing
  pricingModel: 'Subscription | Usage | Hybrid | Free',
  plans: $.Plan.where((p: any) => p.service),

  // SLA
  uptime: 'Uptime SLA percentage',
  supportLevel: 'Community | Email | Priority | Dedicated',
  responseTime: 'Support response time SLA',

  // Customers
  customers: $.Customer.where((c: any) => c.service),
  customerCount: $.count($.customers),

  // Generated
  serviceBenefits: 'Benefits of {name} service',
})
