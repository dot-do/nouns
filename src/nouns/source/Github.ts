/**
 * Github - Code infrastructure
 *
 * Types for GitHub API entities.
 */

import { $, Noun } from '../../core/nouns'
import { Source } from './Source'

export const Github = Source({
  $type: 'Github',
  baseUrl: 'https://api.github.com',
  authMethod: 'Bearer',
  docsUrl: 'https://docs.github.com/en/rest',
})

export const GithubRepo = Noun({
  $type: 'Github.Repo',
  $context: 'https://schema.org.ai',

  // GitHub fields
  id: 'GitHub repo ID',
  name: 'Repository name',
  full_name: 'Full repository name (owner/repo)',
  description: 'Repository description',
  private: 'Is private',
  html_url: 'GitHub URL',

  // Stats
  stargazers_count: 'Star count',
  forks_count: 'Fork count',
  open_issues_count: 'Open issues count',
  watchers_count: 'Watchers count',

  // Metadata
  language: 'Primary language',
  created_at: 'Created timestamp',
  updated_at: 'Updated timestamp',
  pushed_at: 'Last push timestamp',

  // Relationships
  owner: $.Github.User,
})

export const GithubUser = Noun({
  $type: 'Github.User',
  $context: 'https://schema.org.ai',

  id: 'GitHub user ID',
  login: 'Username',
  name: 'Display name',
  email: 'Email',
  avatar_url: 'Avatar URL',
  html_url: 'Profile URL',
  bio: 'Bio',
  company: 'Company',
  location: 'Location',

  // Stats
  public_repos: 'Public repo count',
  followers: 'Follower count',
  following: 'Following count',
})

export const GithubOrganization = Noun({
  $type: 'Github.Organization',
  $context: 'https://schema.org.ai',

  id: 'GitHub org ID',
  login: 'Organization name',
  name: 'Display name',
  description: 'Organization description',
  avatar_url: 'Avatar URL',
  html_url: 'Profile URL',
  email: 'Email',
  location: 'Location',

  // Stats
  public_repos: 'Public repo count',
  followers: 'Follower count',

  // Relationships
  repos: $.Github.Repo.where((r: any) => r.owner),
  members: $.Github.User.where((u: any) => u.organization),
})
