"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/useThemeStore'

const ThemeToggle: React.FC = () => {
  const isDark = useThemeStore((s) => s.isDark)
  const toggle = useThemeStore((s) => s.toggle)

  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      className="relative w-14 h-7 rounded-full p-[3px] bg-surface border border-rule transition-colors duration-300"
      aria-label={isDark ? 'Attiva tema chiaro' : 'Attiva tema scuro'}
    >
      {/* Background icons (faded) */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun
          className="w-3 h-3 text-amber-400 transition-opacity duration-300"
          style={{ opacity: isDark ? 0.2 : 0 }}
        />
        <Moon
          className="w-3 h-3 text-indigo-300 transition-opacity duration-300"
          style={{ opacity: isDark ? 0 : 0.2 }}
        />
      </div>

      {/* Sliding knob */}
      <motion.div
        className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${
          isDark
            ? 'bg-indigo-950 shadow-[0_0_8px_rgba(99,102,241,0.3)]'
            : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
        }`}
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-indigo-300" />
        ) : (
          <Sun className="w-3 h-3 text-amber-800" />
        )}
      </motion.div>
    </button>
  )
}

export default ThemeToggle
