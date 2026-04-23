import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { 
  calculateFeasibility, 
  calculateImpact, 
  FeasibilityInputs, 
  ImpactInputs 
} from '@/lib/engine'

export interface Initiative {
  name: string
  feasibility: FeasibilityInputs
  impact: ImpactInputs
  color: string
  enabled: boolean
}

interface AssessmentState {
  initiatives: Initiative[]
  activeIndex: number
  strategicRationale: Record<string, string>
  
  // Actions
  setActiveIndex: (index: number) => void
  setInitiativeName: (name: string) => void
  updateFeasibility: (key: keyof FeasibilityInputs, value: number) => void
  updateImpact: (key: keyof ImpactInputs, value: number) => void
  toggleInitiativeEnabled: (index: number) => void
  setRationale: (key: string, rationale: string) => void
  
  // Computed
  getFeasibilityScore: (index?: number) => number
  getImpactScore: (index?: number) => number
  getActiveInitiative: () => Initiative
  reset: () => void
  resetInitiative: (index: number) => void
}

const defaultFeasibility: FeasibilityInputs = {
  technicalMaturity: 3,
  infrastructure: 3,
  dataConsistency: 3,
  regulation: 3,
  ethics: 3,
  finance: 3,
  competences: 3,
}

const defaultImpact: ImpactInputs = {
  businessConsistency: 3,
  economicImpact: 3,
  organizationalImpact: 3,
  clientImpact: 3,
  learningImpact: 3,
}

const INITIATIVE_COLORS = ['#00F5FF', '#BF40BF', '#F59E0B']
const INITIATIVE_NAMES = ['Iniziativa A', 'Iniziativa B', 'Iniziativa C']

function createDefaultInitiatives(): Initiative[] {
  return INITIATIVE_COLORS.map((color, i) => ({
    name: INITIATIVE_NAMES[i],
    feasibility: { ...defaultFeasibility },
    impact: { ...defaultImpact },
    color,
    enabled: i === 0, // Only first enabled by default
  }))
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      initiatives: createDefaultInitiatives(),
      activeIndex: 0,
      strategicRationale: {},

      setActiveIndex: (index) => set({ activeIndex: index }),

      setInitiativeName: (name) => set((state) => {
        const initiatives = [...state.initiatives]
        initiatives[state.activeIndex] = { ...initiatives[state.activeIndex], name }
        return { initiatives }
      }),
      
      updateFeasibility: (key, value) => set((state) => {
        const initiatives = [...state.initiatives]
        const current = initiatives[state.activeIndex]
        initiatives[state.activeIndex] = {
          ...current,
          feasibility: { ...current.feasibility, [key]: value }
        }
        return { initiatives }
      }),
      
      updateImpact: (key, value) => set((state) => {
        const initiatives = [...state.initiatives]
        const current = initiatives[state.activeIndex]
        initiatives[state.activeIndex] = {
          ...current,
          impact: { ...current.impact, [key]: value }
        }
        return { initiatives }
      }),

      toggleInitiativeEnabled: (index) => set((state) => {
        const initiatives = [...state.initiatives]
        initiatives[index] = { ...initiatives[index], enabled: !initiatives[index].enabled }
        // If we just disabled the active one, switch to the first enabled
        let activeIndex = state.activeIndex
        if (!initiatives[activeIndex].enabled) {
          const firstEnabled = initiatives.findIndex(i => i.enabled)
          activeIndex = firstEnabled >= 0 ? firstEnabled : 0
        }
        return { initiatives, activeIndex }
      }),
      
      setRationale: (key, rationale) => set((state) => ({
        strategicRationale: { ...state.strategicRationale, [key]: rationale }
      })),

      getFeasibilityScore: (index?: number) => {
        const idx = index ?? get().activeIndex
        return calculateFeasibility(get().initiatives[idx].feasibility)
      },

      getImpactScore: (index?: number) => {
        const idx = index ?? get().activeIndex
        return calculateImpact(get().initiatives[idx].impact)
      },

      getActiveInitiative: () => get().initiatives[get().activeIndex],
      
      reset: () => set({
        initiatives: createDefaultInitiatives(),
        activeIndex: 0,
        strategicRationale: {},
      }),

      resetInitiative: (index) => set((state) => {
        const initiatives = [...state.initiatives]
        initiatives[index] = {
          name: INITIATIVE_NAMES[index],
          feasibility: { ...defaultFeasibility },
          impact: { ...defaultImpact },
          color: INITIATIVE_COLORS[index],
          enabled: initiatives[index].enabled,
        }
        return { initiatives }
      }),
    }),
    {
      name: 'ai-matrix-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
