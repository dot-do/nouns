/**
 * Organization - A company, institution, or group
 *
 * Extends Thing with organizational structure.
 */

import { $ } from '../../core/nouns'
import { Thing } from './Thing'

export const Organization = Thing({
  $type: 'Organization',

  legalName: 'Legal entity name',
  foundingDate: 'Date founded',
  location: 'Headquarters location',
  domain: 'Primary domain',

  // Relationships
  founders: $.Person.where((p: any) => p.organization),
  employees: $.Person.where((p: any) => p.employer),

  // Aggregated
  teamSize: $.count($.employees),
})
