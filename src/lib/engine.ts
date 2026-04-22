export interface FeasibilityInputs {
  technicalMaturity: number
  infrastructure: number
  dataConsistency: number
  regulation: number
  ethics: number
  finance: number
  competences: number
}

export interface ImpactInputs {
  businessConsistency: number
  economicImpact: number
  organizationalImpact: number
  clientImpact: number
  learningImpact: number
}

/**
 * Calculates the Technical Feasibility score (max 35) based on the Bocconi framework.
 * Malus Rule: Infrastructure, Regulation, and Competences are weighted at 50% if their score is <= 2.
 */
export function calculateFeasibility(inputs: FeasibilityInputs): number {
  const malusVariables: (keyof FeasibilityInputs)[] = ['infrastructure', 'regulation', 'competences']
  
  let total = 0
  
  for (const key in inputs) {
    const value = inputs[key as keyof FeasibilityInputs]
    if (malusVariables.includes(key as keyof FeasibilityInputs) && value <= 2) {
      total += value * 0.5
    } else {
      total += value
    }
  }
  
  return total
}

/**
 * Calculates the Business Impact score (max 25) based on the Bocconi framework.
 * Malus Rule: Learning Impact is halved if the sum of all other impact variables is <= 6.
 */
export function calculateImpact(inputs: ImpactInputs): number {
  const { learningImpact, ...others } = inputs
  const sumOthers = Object.values(others).reduce((sum, val) => sum + val, 0)
  
  const finalLearningImpact = sumOthers <= 6 ? learningImpact * 0.5 : learningImpact
  
  return sumOthers + finalLearningImpact
}
