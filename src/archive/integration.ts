import { DO } from './do/do'

export const API = DO({
  $type: 'API',
  $version: 1,

  // Identity
  name: 'API name',
  description: 'What the API does',
  version: 'API version',

  // Type
  type: 'REST | GraphQL | gRPC | WebSocket | Webhook',

  // Endpoints
  baseUrl: 'Base URL',
  endpoints: [{
    path: 'Endpoint path',
    method: 'GET | POST | PUT | PATCH | DELETE',
    description: 'What it does',
    auth: 'Required authentication',
  }],

  // Documentation
  openapi: 'OpenAPI spec URL',
  documentation: 'Documentation URL',

  // Authentication
  auth: {
    type: 'None | ApiKey | Bearer | Basic | OAuth2 | JWT',
    location: 'Header | Query | Body',
  },

  // Rate limits
  rateLimit: {
    requests: 'Requests per window (number)',
    window: 'Window in seconds (number)',
  },

  // Relationships
  owner: 'API provider ->Business',
  integrations: ['<- Integration.api'],
  sdks: ['Client SDKs ->SDK'],

  // Monitoring
  everyMinute: ($) => $.call('checkHealth', []),
})

export const Integration = DO({
  $type: 'Integration',
  $version: 1,

  // Identity
  name: 'Integration name',
  description: 'What it connects',

  // Connection
  source: 'Source system ->App',
  target: 'Target system ->App',
  api: 'API used ->API',

  // Authentication
  oauth: {
    enabled: 'OAuth enabled (boolean)',
    authUrl: 'Authorization URL',
    tokenUrl: 'Token URL',
    scopes: ['Required scopes'],
  },

  // Sync
  sync: {
    enabled: 'Sync enabled (boolean)',
    direction: 'Inbound | Outbound | Bidirectional',
    frequency: 'Realtime | Hourly | Daily | Manual',
  },

  // Mapping
  mappings: [{
    source: 'Source field',
    target: 'Target field',
    transform: 'Transformation logic',
  }],

  // Status
  status: 'Active | Paused | Error | Disconnected',
  lastSync: 'Last sync time (date)',

  // Relationships
  workflows: ['Triggered workflows ->Workflow'],
})
