import { DO } from './do/do'

export const Person = DO({
  $type: 'Person',
  $version: 1,

  // Identity
  name: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  avatar: 'Avatar URL',

  // Professional
  title: 'Job title',
  role: 'Organizational role ->Role',
  department: 'Department name',
  manager: 'Reports to ->Person',
  reports: ['Direct reports <-Person.manager'],

  // Capabilities
  skills: ['Professional skills'],
  expertise: ['Areas of expertise'],
  certifications: ['Professional certifications'],

  // Work
  teams: ['Team memberships ->Team'],
  projects: ['Active projects ->Project'],
  tasks: ['Assigned tasks <-Task.assignee'],

  // Contact
  linkedin: 'LinkedIn URL',
  twitter: 'Twitter/X handle',
  github: 'GitHub username',
  timezone: 'IANA timezone',

  // Employment
  employer: 'Current employer ->Business',
  startDate: 'Employment start date (date)',
  type: 'FullTime | PartTime | Contractor | Advisor | Intern',

  // Events
  onPersonJoined: (person, $) => $.emit('person.joined', { id: person.$id }),
})

export const Role = DO({
  $type: 'Role',
  $version: 1,

  // Identity
  name: 'Role name',
  description: 'Role description',
  type: 'Executive | Manager | Individual | Advisor | Board',

  // Position
  department: 'Department name',
  level: 'Seniority level (number)',
  reportsTo: 'Reporting role ->Role',

  // Responsibilities
  responsibilities: ['Key responsibilities'],
  decisions: ['Decisions this role can make'],
  permissions: ['System permissions'],

  // Requirements
  skills: ['Required skills'],
  experience: 'Required experience years (number)',
  education: 'Required education level',

  // Work model
  workerType: 'Human | AI | Hybrid',
  canDelegate: 'Can delegate work (boolean)',
  canApprove: 'Can approve decisions (boolean)',
  escalateTo: 'Escalation path ->Role',

  // Tools
  tools: ['Tools this role uses ->Tool'],
  outputs: ['Expected outputs'],

  // Relationships
  holders: ['<- Person.role'],
  agents: ['AI agents in this role <-Agent.role'],
})
