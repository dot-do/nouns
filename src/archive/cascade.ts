/**
 * Cascade Generation Pattern Demonstration
 *
 * This file demonstrates how entities cascade-generate other entities
 * in the Startup Experimentation Machine flow.
 *
 * NOTE: The actual noun definitions are in their respective module files.
 * This file shows HOW cascades work, not re-definitions of the nouns.
 *
 * =============================================================================
 * CASCADE FLOW
 * =============================================================================
 *
 * Problem (human input)
 *     ↓ generate 'Who has this problem?'
 * IdealCustomerProfile
 *     ↓ generate 'Size the market for {icp}'
 * Market
 *     ↓ generate 'How to solve {problem}?'
 * Solution
 *     ↓ generate 'Position vs alternatives'
 * Positioning
 *     ↓ generate 'What to test?'
 * Hypothesis
 *     ↓ generate 'Value proposition'
 * Offer
 *     ↓ generate 'How to validate?'
 * Experiment
 *     ├─→ generate 'Create landing page'
 *     │   LandingPage
 *     └─→ generate 'Create ads'
 *         Ad[]
 *             ↓ measure (external)
 *         Visitor[] → Conversion[]
 *             ↓ aggregate
 *         ExperimentResults
 *             ↓ generate 'What did we learn?'
 *         Learning
 *             ↓ iterate
 *         Hypothesis (next cycle)
 *
 * =============================================================================
 * GENERATION VS LINKING SYNTAX
 * =============================================================================
 *
 * GENERATIVE CASCADE (text before operator = AI generation prompt):
 *   icps: ['Who specifically has this problem? ->IdealCustomerProfile']
 *   market: 'Size the market for this ICP ->Market'
 *
 * LINKED CASCADE (no text = just reference, no generation):
 *   customer: '->Customer'
 *   experiment: '<-Offer.experiment'
 *
 * FUZZY/GROUNDED (vector similarity search):
 *   occupation: '<~Occupation'     // Ground against reference data
 *   similar: '~>Startup'           // Find similar entities
 *
 * =============================================================================
 */

export {}  // Make this a module

// The cascade relationships are defined IN each noun's definition.
// See: src/market.ts, src/experiments.ts, src/content.ts, src/strategy.ts
//
// Example from IdealCustomerProfile in market.ts:
//
//   export const IdealCustomerProfile = DO({
//     $type: 'IdealCustomerProfile',
//     ...
//     // GENERATES Market from this ICP
//     market: 'What is the market size for this ICP? ->Market',
//
//     // LINKS back to Problem (incoming reference)
//     problem: '<-Problem.icps',
//   })
