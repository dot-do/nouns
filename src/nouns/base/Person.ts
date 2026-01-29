/**
 * Person - A human being
 *
 * Extends Thing with personal information.
 */

import { $ } from '../../core/nouns'
import { Thing } from './Thing'

export const Person = Thing({
  $type: 'Person',

  email: 'Email address',
  phone: 'Phone number',
  avatar: 'Avatar URL',

  // Computed
  displayName: ($: any) => $.name || $.email?.split('@')[0] || 'Unknown',
})
