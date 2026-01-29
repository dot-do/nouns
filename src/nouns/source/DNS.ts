/**
 * DNS - Domain name system
 *
 * Types for DNS records and queries.
 */

import { Noun } from '../../core/nouns'
import { Source } from './Source'

export const DNS = Source({
  $type: 'DNS',
  baseUrl: 'https://dns.google/resolve',
  authMethod: 'None',
  docsUrl: 'https://developers.google.com/speed/public-dns/docs/doh',
})

export const DNSRecord = Noun({
  $type: 'DNS.Record',
  $context: 'https://schema.org.ai',

  name: 'Domain name',
  type: 'A | AAAA | CNAME | MX | TXT | NS',
  value: 'Record value',
  ttl: 'Time to live',
})
