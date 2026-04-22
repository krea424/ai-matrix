import { describe, it, expect, beforeEach } from 'vitest'
import { useAssessmentStore } from '../useAssessmentStore'

describe('useAssessmentStore', () => {
  beforeEach(() => {
    useAssessmentStore.setState({
      feasibility: {
        technicalMaturity: 3,
        infrastructure: 3,
        dataConsistency: 3,
        regulation: 3,
        ethics: 3,
        finance: 3,
        competences: 3,
      },
      impact: {
        businessConsistency: 3,
        economicImpact: 3,
        organizationalImpact: 3,
        clientImpact: 3,
        learningImpact: 3,
      },
      initiativeName: '',
      strategicRationale: {},
    })
  })

  it('should initialize with default values', () => {
    const state = useAssessmentStore.getState()
    expect(state.feasibility.technicalMaturity).toBe(3)
    expect(state.impact.economicImpact).toBe(3)
  })

  it('should update feasibility inputs', () => {
    useAssessmentStore.getState().updateFeasibility('technicalMaturity', 5)
    expect(useAssessmentStore.getState().feasibility.technicalMaturity).toBe(5)
  })

  it('should update impact inputs', () => {
    useAssessmentStore.getState().updateImpact('economicImpact', 5)
    expect(useAssessmentStore.getState().impact.economicImpact).toBe(5)
  })

  it('should calculate scores correctly', () => {
    // 3*7 = 21
    expect(useAssessmentStore.getState().getFeasibilityScore()).toBe(21)
    // 3*5 = 15
    expect(useAssessmentStore.getState().getImpactScore()).toBe(15)
    
    useAssessmentStore.getState().updateFeasibility('technicalMaturity', 5)
    // 21 - 3 + 5 = 23
    expect(useAssessmentStore.getState().getFeasibilityScore()).toBe(23)
  })
})
