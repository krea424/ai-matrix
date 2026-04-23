"use client"

import React from 'react'
import { VariableMeta } from '@/lib/variables'

interface ScoreSliderProps {
  variable: VariableMeta
  value: number
  onChange: (value: number) => void
}

const ScoreSlider: React.FC<ScoreSliderProps> = ({ variable, value, onChange }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Score buttons */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            id={`score-${variable.key}-${score}`}
            onClick={() => onChange(score)}
            className={`
              relative flex-1 h-11 rounded-lg text-sm font-bold transition-all duration-300
              ${
                value === score
                  ? 'bg-gradient-to-br from-electric-cyan/90 to-amethyst-violet/90 text-white shadow-[var(--shadow-elevated)] scale-105'
                  : 'bg-inset text-ink-3 hover:bg-surface-hover hover:text-ink-2 border border-rule'
              }
            `}
          >
            {score}
          </button>
        ))}
      </div>

      {/* Scale labels */}
      <div className="flex items-stretch gap-1.5">
        {variable.scaleLabels.map((label, i) => (
          <div
            key={i}
            className={`
              flex-1 text-center text-[9px] leading-tight px-0.5 py-1 rounded-md transition-all duration-300
              ${
                value === i + 1
                  ? 'text-electric-cyan font-semibold bg-electric-cyan/5'
                  : 'text-ink-4'
              }
            `}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Malus indicator */}
      {variable.hasMalus && (
        <div
          className={`
            text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all duration-300
            ${
              value <= 2
                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                : 'bg-inset text-ink-4'
            }
          `}
        >
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{variable.malusNote}</span>
        </div>
      )}
    </div>
  )
}

export default ScoreSlider
