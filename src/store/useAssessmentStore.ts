import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { 
  calculateFeasibility, 
  calculateImpact, 
  FeasibilityInputs, 
  ImpactInputs 
} from '@/lib/engine'

interface AssessmentState {
  initiativeName: string
  feasibility: FeasibilityInputs
  impact: ImpactInputs
  strategicRationale: Record<string, string>
  
  // Actions
  setInitiativeName: (name: string) => void
  updateFeasibility: (key: keyof FeasibilityInputs, value: number) => void
  updateImpact: (key: keyof ImpactInputs, value: number) => void
  setRationale: (key: string, rationale: string) => void
  
  // Computed (Helper methods)
  getFeasibilityScore: () => number
  getImpactScore: () => number
  reset: () => void
}

const initialFeasibility: FeasibilityInputs = {
  technicalMaturity: 3,
  infrastructure: 3,
  dataConsistency: 3,
  regulation: 3,
  ethics: 3,
  finance: 3,
  competences: 3,
}

const initialImpact: ImpactInputs = {
  businessConsistency: 3,
  economicImpact: 3,
  organizationalImpact: 3,
  clientImpact: 3,
  learningImpact: 3,
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      initiativeName: '',
      feasibility: initialFeasibility,
      impact: initialImpact,
      strategicRationale: {},

      setInitiativeName: (name) => set({ initiativeName: name }),
      
      updateFeasibility: (key, value) => set((state) => ({
        feasibility: { ...state.feasibility, [key]: value }
      })),
      
      updateImpact: (key, value) => set((state) => ({
        impact: { ...state.impact, [key]: value }
      })),
      
      setRationale: (key, rationale) => set((state) => ({
        strategicRationale: { ...state.strategicRationale, [key]: rationale }
      })),

      getFeasibilityScore: () => calculateFeasibility(get().feasibility),
      getImpactScore: () => calculateImpact(get().impact),
      
      reset: () => set({
        initiativeName: '',
        feasibility: initialFeasibility,
        impact: initialImpact,
        strategicRationale: {},
      }),
    }),
    {
      name: 'ai-matrix-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
