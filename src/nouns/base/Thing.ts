/**
 * Thing - The most generic type
 *
 * Everything extends from Thing. Based on schema.org/Thing.
 */

import { Noun } from '../../core/nouns'

export const Thing = Noun({
  $type: 'Thing',
  $context: 'https://schema.org.ai',

  name: 'Name',
  description: 'Description',
  url: 'URL',
  image: 'Image URL',
  slug: 'URL-safe identifier',
})
