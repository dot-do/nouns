/**
 * API - Application Programming Interface
 *
 * A product that exposes functionality via HTTP endpoints.
 */

import { $ } from '../../core/nouns'
import { Product } from './Product'

export const API = Product({
  $type: 'API',

  productKind: 'API',

  // API-specific
  version: 'API version',
  baseUrl: 'Base URL',
  docsUrl: 'Documentation URL',
  openApiSpec: 'OpenAPI spec URL',

  // Auth
  authMethod: 'API Key | OAuth | JWT | Bearer',

  // Rate limits
  rateLimit: 'Requests per minute',
  rateLimitTier: 'Rate limit by plan',

  // Endpoints
  endpoints: $.Endpoint.where((e: any) => e.api),
  endpointCount: $.count($.endpoints),

  // Usage
  totalRequests: $.sum($.usage.requests),
  avgLatency: $.avg($.usage.latency),

  // Generated
  quickstart: 'Quickstart guide for {name} API',
})
