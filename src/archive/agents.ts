import { DO } from './do/do'

export const Agent = DO({
  $type: 'Agent',
  $version: 1,

  // Identity
  name: 'Agent name',
  role: 'What the agent does',
  avatar: 'Agent avatar URL',

  // Configuration
  model: 'claude-opus-4.5 | claude-sonnet-4 | gpt-4o | gpt-4-turbo | gemini-pro',
  systemPrompt: 'System prompt defining behavior',
  temperature: 'Creativity level 0-1 (number)',

  // Capabilities
  capabilities: ['text | code | analysis | research | planning | execution | multimodal'],
  tools: ['Available tools ->Tool'],
  skills: ['Learned skills ->Skill'],

  // Memory
  memory: {
    type: 'None | Buffer | Summary | Vector | Hybrid',
    maxTokens: 'Token limit (number)',
    scope: 'Session | User | Workspace | Global',
  },

  // Execution
  status: 'Idle | Running | Waiting | Error',
  currentTask: 'Active task ID',
  maxToolCalls: 'Tool call limit per run (number)',
  timeout: 'Execution timeout seconds (number)',

  // Guardrails
  guardrails: {
    contentFilter: 'Content filtering enabled (boolean)',
    pii: 'PII detection enabled (boolean)',
    toxicity: 'Toxicity filter enabled (boolean)',
    costLimit: 'Max cost per run (number)',
  },

  // Handoff
  handoff: {
    enabled: 'Can hand off to other agents (boolean)',
    agents: ['Agents to hand off to ->Agent'],
    conditions: 'When to hand off',
  },

  // Relationships
  team: 'Agent team <-Team.agents',
  memories: ['Stored memories ->Memory'],
  executions: ['<- AgentExecution.agent'],

  // Functions
  plan: { mdx: 'Create execution plan for: {task}' },
  execute: { mdx: 'Execute step {step} of plan for: {task}' },
  reflect: { mdx: 'Reflect on execution of {task} and extract learnings' },

  // Events
  onTaskAssigned: (task, $) => $.call('plan', [task]),
  onStepCompleted: (result, $) => $.call('recordMemory', [result]),
  onErrorEncountered: (err, $) => $.call('escalate', [err]),
})

export const Team = DO({
  $type: 'Team',
  $version: 1,

  // Identity
  name: 'Team name',
  purpose: 'What the team accomplishes',
  type: 'Agent | Human | Hybrid',

  // Composition
  agents: ['AI team members ->Agent'],
  humans: ['Human team members ->Person'],
  manager: 'Team lead ->Agent | Person',

  // Orchestration
  orchestration: 'Sequential | Parallel | Hierarchical | Consensus | Dynamic',
  communication: 'Broadcast | Directed | SharedContext',
  maxIterations: 'Max collaboration rounds (number)',

  // Configuration
  successCriteria: 'How to determine success',
  conflictResolution: 'How to resolve disagreements',
  escalationPolicy: 'When to escalate',

  // Relationships
  workflows: ['Team workflows ->Workflow'],
  projects: ['<- Project.team'],

  // Events
  onTaskReceived: (task, $) => $.call('assignToMember', [task]),
  onConsensusReached: (decision, $) => $.emit('team.decided', decision),
})

export const Tool = DO({
  $type: 'Tool',
  $version: 1,

  // Identity
  name: 'Tool name',
  description: 'What the tool does (for AI)',
  category: 'Data | Communication | File | Web | Code | Database | AI | Integration | System',

  // Interface
  parameters: [{
    name: 'Parameter name',
    type: 'string | number | boolean | array | object',
    description: 'Parameter description',
    required: 'Is required (boolean)',
  }],
  returns: {
    type: 'Return type',
    description: 'What is returned',
  },

  // Safety
  requiresConfirmation: 'Needs human approval (boolean)',
  dangerous: 'Can cause damage (boolean)',
  permissions: ['Required permissions'],
  rateLimit: {
    requests: 'Max requests (number)',
    window: 'Time window seconds (number)',
  },

  // Examples
  examples: [{
    input: 'Example input (JSON)',
    output: 'Example output',
  }],

  // Relationships
  agents: ['<- Agent.tools'],
  workflows: ['<- WorkflowStep.tool'],
})

export const Workflow = DO({
  $type: 'Workflow',
  $version: 1,

  // Identity
  name: 'Workflow name',
  description: 'What the workflow accomplishes',
  version: 'Workflow version',

  // Status
  status: 'Draft | Active | Deprecated | Archived',
  active: 'Is currently active (boolean)',

  // Definition
  steps: [{
    id: 'Step identifier',
    name: 'Step name',
    type: 'Agent | Tool | Condition | Loop | Parallel | Wait | Human | Transform | Webhook',
    config: 'Step-specific configuration (JSON)',
    next: 'Next step ID or conditions',
  }],
  startStep: 'Initial step ID',
  variables: 'Workflow variables (JSON)',

  // Triggers
  triggers: [{
    type: 'Manual | Schedule | Webhook | Event | Database | Email | Form',
    config: 'Trigger configuration (JSON)',
  }],

  // Execution
  timeout: 'Max execution time seconds (number)',
  retryPolicy: {
    maxAttempts: 'Max retry attempts (number)',
    backoff: 'Fixed | Exponential',
    delay: 'Retry delay ms (number)',
  },

  // Relationships
  owner: 'Owning entity ->Business',
  team: 'Executing team ->Team',
  executions: ['<- WorkflowExecution.workflow'],

  // Events
  onWorkflowStarted: (exec, $) => $.emit('workflow.started', exec),
  onWorkflowCompleted: (result, $) => $.emit('workflow.completed', result),
  onWorkflowFailed: (err, $) => $.call('handleFailure', [err]),
})

export const Function = DO({
  $type: 'Function',
  $version: 1,

  // Identity
  name: 'Function name',
  description: 'What the function does',
  version: 'Function version (number)',

  // Type
  type: 'Code | Generative | Hybrid',

  // Code function
  code: {
    module: 'JavaScript/TypeScript module code',
    runtime: 'Node | Deno | Bun | Edge',
    entrypoint: 'Export name to call',
    timeout: 'Execution timeout ms (number)',
  },

  // Generative function
  generative: {
    prompt: 'MDX prompt template',
    model: 'Model to use',
    outputSchema: 'Expected output structure (JSON)',
  },

  // Interface
  parameters: [{
    name: 'Parameter name',
    type: 'Parameter type',
    description: 'Parameter description',
    required: 'Is required (boolean)',
    default: 'Default value',
  }],
  returns: {
    type: 'Return type',
    description: 'Return description',
  },

  // Testing
  tests: 'Test code',
  examples: [{
    input: 'Example input',
    expectedOutput: 'Expected output',
  }],

  // Dependencies
  imports: ['External dependencies'],

  // Relationships
  usedBy: ['<- Workflow.functions'],
})
