/**
 * Vercel - Deployment infrastructure
 *
 * Types for Vercel API entities.
 */

import { $, Noun } from '../../core/nouns'
import { Source } from './Source'

export const Vercel = Source({
  $type: 'Vercel',
  baseUrl: 'https://api.vercel.com',
  authMethod: 'Bearer',
  docsUrl: 'https://vercel.com/docs/rest-api',
})

export const VercelDeployment = Noun({
  $type: 'Vercel.Deployment',
  $context: 'https://schema.org.ai',

  id: 'Deployment ID',
  url: 'Deployment URL',
  state: 'READY | BUILDING | ERROR | QUEUED | CANCELED',
  createdAt: 'Created timestamp',

  // Relationships
  project: $.Vercel.Project,
})

export const VercelProject = Noun({
  $type: 'Vercel.Project',
  $context: 'https://schema.org.ai',

  id: 'Project ID',
  name: 'Project name',
  framework: 'Framework',

  // Relationships
  deployments: $.Vercel.Deployment.where((d: any) => d.project),
})
