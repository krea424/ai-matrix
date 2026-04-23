import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'ai-matrix-theme',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
