/**
 * ManagedService - A fully managed offering
 *
 * A service where the provider handles all operations.
 */

import { $ } from '../../core/nouns'
import { Service } from './Service'

export const ManagedService = Service({
  $type: 'ManagedService',

  deploymentType: 'Managed',

  // Managed-specific
  infrastructure: 'Cloud provider and setup',
  regions: 'Available regions',
  compliance: 'Compliance certifications',

  // Includes
  includes: 'What is included in the managed service',
  monitoring: 'Monitoring and alerting',
  backups: 'Backup policy',

  // Generated
  comparisonToSelfHosted: 'Comparison of {name} managed vs self-hosted',
})
