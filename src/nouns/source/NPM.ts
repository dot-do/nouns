/**
 * NPM - Package registry
 *
 * Types for NPM registry entities.
 */

import { Noun } from '../../core/nouns'
import { Source } from './Source'

export const NPM = Source({
  $type: 'NPM',
  baseUrl: 'https://registry.npmjs.org',
  authMethod: 'Bearer',
  docsUrl: 'https://docs.npmjs.com/registry-api',
})

export const NPMPackage = Noun({
  $type: 'NPM.Package',
  $context: 'https://schema.org.ai',

  name: 'Package name',
  version: 'Latest version',
  description: 'Package description',
  downloads: 'Weekly downloads',
  license: 'License',
  repository: 'Repository URL',
  homepage: 'Homepage URL',
})
