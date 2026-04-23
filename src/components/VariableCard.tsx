"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VariableMeta } from '@/lib/variables'
import ScoreSlider from './ScoreSlider'
import { ChevronDown } from 'lucide-react'

interface VariableCardProps {
  variable: VariableMeta
  value: number
  onChange: (value: number) => void
  accentColor?: 'cyan' | 'violet'
  index: number
  collapseKey?: number
}

const VariableCard: React.FC<VariableCardProps> = ({
  variable,
  value,
  onChange,
  accentColor = 'cyan',
  index,
  collapseKey = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (collapseKey > 0) setIsExpanded(false)
  }, [collapseKey])

  const accentClasses = {
    cyan: {
      border: 'border-electric-cyan/15 hover:border-electric-cyan/30',
      activeBorder: 'border-electric-cyan/40',
      badge: 'bg-electric-cyan/10 text-electric-cyan',
      dot: 'bg-electric-cyan',
    },
    violet: {
      border: 'border-amethyst-violet/15 hover:border-amethyst-violet/30',
      activeBorder: 'border-amethyst-violet/40',
      badge: 'bg-amethyst-violet/10 text-amethyst-violet',
      dot: 'bg-amethyst-violet',
    },
  }

  const accent = accentClasses[accentColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`
        rounded-xl border transition-all duration-300 overflow-hidden
        bg-surface shadow-[var(--shadow-card)]
        ${isExpanded ? `${accent.activeBorder} shadow-[var(--shadow-elevated)]` : accent.border}
      `}
    >
      {/* Header */}
      <button
        id={`variable-${variable.key}`}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${accent.dot} ${value >= 4 ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium text-ink truncate">
            {variable.label}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent.badge}`}>
            {value}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-ink-3 group-hover:text-ink-2 transition-colors" />
          </motion.div>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <p className="text-xs text-ink-3 leading-relaxed">
                {variable.description}
              </p>
              <ScoreSlider variable={variable} value={value} onChange={onChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VariableCard
