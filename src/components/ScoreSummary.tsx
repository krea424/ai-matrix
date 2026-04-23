"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useAssessmentStore, Initiative } from '@/store/useAssessmentStore'
import { calculateFeasibility, calculateImpact } from '@/lib/engine'
import { Eye, EyeOff, RotateCcw } from 'lucide-react'

function getZoneLabel(feasibility: number, impact: number): { label: string; color: string } {
  const fZone = feasibility < 19 ? 0 : feasibility < 28 ? 1 : 2
  const iZone = impact < 12 ? 0 : impact < 19 ? 1 : 2

  const zones: Record<string, { label: string; color: string }> = {
    '0-0': { label: 'NON PROCEDERE', color: 'text-red-500' },
    '0-1': { label: 'CAUTELA', color: 'text-amber-500' },
    '0-2': { label: 'INVESTIRE IN FATTIBILITÀ', color: 'text-amber-500' },
    '1-0': { label: 'ESPLORARE', color: 'text-ink-3' },
    '1-1': { label: 'PROCEDERE CON CAUTELA', color: 'text-yellow-600' },
    '1-2': { label: 'PRIORITÀ STRATEGICA', color: 'text-electric-cyan' },
    '2-0': { label: 'QUICK WIN', color: 'text-emerald-600' },
    '2-1': { label: 'PROCEDERE', color: 'text-emerald-600' },
    '2-2': { label: 'GO — MASSIMA PRIORITÀ', color: 'text-emerald-500' },
  }

  return zones[`${fZone}-${iZone}`] || zones['1-1']
}

interface InitiativeScoreCardProps {
  initiative: Initiative
  index: number
  isActive: boolean
  onSelect: () => void
  onToggle: () => void
  onReset: () => void
}

const InitiativeScoreCard: React.FC<InitiativeScoreCardProps> = ({
  initiative, index, isActive, onSelect, onToggle, onReset,
}) => {
  const fScore = calculateFeasibility(initiative.feasibility)
  const iScore = calculateImpact(initiative.impact)
  const zone = getZoneLabel(fScore, iScore)
  const fPct = Math.round((fScore / 35) * 100)
  const iPct = Math.round((iScore / 25) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={`
        rounded-xl border p-3.5 cursor-pointer transition-all duration-300 space-y-3
        ${isActive
          ? 'border-rule bg-surface shadow-[var(--shadow-elevated)]'
          : 'border-rule-soft bg-surface/50 hover:border-rule'
        }
        ${!initiative.enabled ? 'opacity-40' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              backgroundColor: initiative.color,
              boxShadow: isActive ? `0 0 10px ${initiative.color}60` : 'none',
            }}
          />
          <span className={`text-xs font-bold truncate ${isActive ? 'text-ink' : 'text-ink-3'}`}>
            {initiative.name || `Iniziativa ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggle() }}
            className="p-1 rounded hover:bg-surface-hover transition-colors"
            title={initiative.enabled ? 'Nascondi' : 'Mostra'}
          >
            {initiative.enabled
              ? <Eye className="w-3 h-3 text-ink-3" />
              : <EyeOff className="w-3 h-3 text-ink-4" />
            }
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onReset() }}
            className="p-1 rounded hover:bg-surface-hover transition-colors"
            title="Resetta"
          >
            <RotateCcw className="w-3 h-3 text-ink-4 hover:text-ink-3" />
          </button>
        </div>
      </div>

      {/* Scores */}
      {initiative.enabled && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="text-[9px] font-bold tracking-wider text-electric-cyan/60 uppercase">Fatt.</div>
              <div className="flex items-baseline gap-0.5">
                <motion.span
                  key={fScore}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg font-black text-electric-cyan tabular-nums"
                >
                  {fScore.toFixed(1)}
                </motion.span>
                <span className="text-[9px] text-ink-4">/35</span>
              </div>
              <div className="w-full bg-inset rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-electric-cyan/80"
                  animate={{ width: `${fPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] font-bold tracking-wider text-amethyst-violet/60 uppercase">Imp.</div>
              <div className="flex items-baseline gap-0.5">
                <motion.span
                  key={iScore}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg font-black text-amethyst-violet tabular-nums"
                >
                  {iScore.toFixed(1)}
                </motion.span>
                <span className="text-[9px] text-ink-4">/25</span>
              </div>
              <div className="w-full bg-inset rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-amethyst-violet/80"
                  animate={{ width: `${iPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Zone recommendation */}
          <div className={`text-[10px] font-black tracking-wide ${zone.color}`}>
            {zone.label}
          </div>
        </>
      )}
    </motion.div>
  )
}

const ScoreSummary: React.FC = () => {
  const initiatives = useAssessmentStore((s) => s.initiatives)
  const activeIndex = useAssessmentStore((s) => s.activeIndex)
  const setActiveIndex = useAssessmentStore((s) => s.setActiveIndex)
  const toggleInitiativeEnabled = useAssessmentStore((s) => s.toggleInitiativeEnabled)
  const resetInitiative = useAssessmentStore((s) => s.resetInitiative)
  const setInitiativeName = useAssessmentStore((s) => s.setInitiativeName)
  const reset = useAssessmentStore((s) => s.reset)

  return (
    <div className="space-y-4">
      {/* Initiative Name Edit for active */}
      <div className="space-y-2">
        <label htmlFor="initiative-name" className="text-[10px] font-bold tracking-[0.2em] text-ink-3 uppercase">
          Nome Iniziativa Attiva
        </label>
        <input
          id="initiative-name"
          type="text"
          value={initiatives[activeIndex].name}
          onChange={(e) => setInitiativeName(e.target.value)}
          placeholder="es. Chatbot assistenza clienti…"
          className="w-full bg-inset border border-rule rounded-lg px-3 py-2.5 text-sm text-ink placeholder-ink-4 focus:outline-none focus:border-electric-cyan/40 focus:ring-1 focus:ring-electric-cyan/20 transition-all"
          style={{ borderColor: `${initiatives[activeIndex].color}20` }}
        />
      </div>

      {/* All 3 initiative cards */}
      <div className="space-y-2">
        {initiatives.map((init, i) => (
          <InitiativeScoreCard
            key={i}
            initiative={init}
            index={i}
            isActive={i === activeIndex}
            onSelect={() => { setActiveIndex(i); if (!init.enabled) toggleInitiativeEnabled(i) }}
            onToggle={() => toggleInitiativeEnabled(i)}
            onReset={() => resetInitiative(i)}
          />
        ))}
      </div>

      {/* Global reset */}
      <button
        id="reset-assessment"
        onClick={reset}
        className="w-full py-2.5 rounded-lg border border-rule text-xs font-medium text-ink-3 hover:text-ink-2 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300"
      >
        Resetta tutto
      </button>
    </div>
  )
}

export default ScoreSummary
