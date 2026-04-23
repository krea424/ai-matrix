"use client"

import React from 'react'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { feasibilityVariables, impactVariables } from '@/lib/variables'
import { calculateFeasibility, calculateImpact } from '@/lib/engine'

function scoreColor(score: number): string {
  if (score <= 2) return 'text-red-500'
  if (score === 3) return 'text-yellow-600'
  return 'text-emerald-600'
}

function scoreBg(score: number): string {
  if (score <= 2) return 'bg-red-500/10'
  if (score === 3) return 'bg-yellow-500/5'
  return 'bg-emerald-500/10'
}

function deltaIndicator(a: number, b: number): string {
  if (a > b) return '↑'
  if (a < b) return '↓'
  return '='
}

const ComparisonTable: React.FC<{ className?: string }> = ({ className }) => {
  const initiatives = useAssessmentStore((s) => s.initiatives)
  const enabled = initiatives.filter((i) => i.enabled)

  return (
    <div className={`bg-[var(--matrix-bg)] rounded-xl border border-rule shadow-[var(--shadow-card)] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-rule">
              <th className="px-4 py-3 text-left text-ink-3 font-bold uppercase tracking-wider text-[10px] w-[200px]">
                Variabile
              </th>
              {enabled.map((init, i) => (
                <th key={i} className="px-3 py-3 text-center font-bold text-[10px] uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: init.color }} />
                    <span className="text-ink-2">{init.name}</span>
                  </div>
                </th>
              ))}
              {enabled.length > 1 && (
                <th className="px-3 py-3 text-center text-ink-4 font-bold text-[10px] uppercase tracking-wider">
                  Δ Best
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Feasibility Section */}
            <tr className="bg-electric-cyan/5">
              <td colSpan={enabled.length + (enabled.length > 1 ? 2 : 1)} className="px-4 py-2 text-electric-cyan font-black text-[10px] uppercase tracking-[0.2em]">
                ● Fattibilità Tecnica
              </td>
            </tr>
            {feasibilityVariables.map((v) => {
              const scores = enabled.map((init) => init.feasibility[v.key as keyof FeasibilityInputs] || 3)
              const best = Math.max(...scores)
              return (
                <tr key={v.key} className="border-b border-rule-soft hover:bg-surface-hover/50 transition-colors">
                  <td className="px-4 py-2.5 text-ink-2 font-medium">{v.label}</td>
                  {scores.map((score, i) => (
                    <td key={i} className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${scoreColor(score)} ${scoreBg(score)}`}>
                        {score}
                      </span>
                    </td>
                  ))}
                  {enabled.length > 1 && (
                    <td className="px-3 py-2.5 text-center text-ink-4 text-[10px] font-mono">
                      {scores.map((s, i) => (
                        <span key={i} className={`mx-0.5 ${s === best ? 'text-emerald-500 font-bold' : 'text-ink-4'}`}>
                          {deltaIndicator(s, best)}
                        </span>
                      ))}
                    </td>
                  )}
                </tr>
              )
            })}
            {/* Feasibility Subtotal */}
            <tr className="border-b-2 border-rule bg-surface-hover/30">
              <td className="px-4 py-3 text-electric-cyan font-bold text-[11px]">
                SUBTOTALE
              </td>
              {enabled.map((init, i) => {
                const score = calculateFeasibility(init.feasibility)
                return (
                  <td key={i} className="px-3 py-3 text-center">
                    <span className="text-electric-cyan font-black text-base">
                      {score.toFixed(1)}
                    </span>
                    <span className="text-ink-4 text-[9px]">/35</span>
                  </td>
                )
              })}
              {enabled.length > 1 && <td />}
            </tr>

            {/* Impact Section */}
            <tr className="bg-amethyst-violet/5">
              <td colSpan={enabled.length + (enabled.length > 1 ? 2 : 1)} className="px-4 py-2 text-amethyst-violet font-black text-[10px] uppercase tracking-[0.2em]">
                ● Impatto di Business
              </td>
            </tr>
            {impactVariables.map((v) => {
              const scores = enabled.map((init) => (init.impact as Record<string, number>)[v.key] || 3)
              const best = Math.max(...scores)
              return (
                <tr key={v.key} className="border-b border-rule-soft hover:bg-surface-hover/50 transition-colors">
                  <td className="px-4 py-2.5 text-ink-2 font-medium">{v.label}</td>
                  {scores.map((score, i) => (
                    <td key={i} className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${scoreColor(score)} ${scoreBg(score)}`}>
                        {score}
                      </span>
                    </td>
                  ))}
                  {enabled.length > 1 && (
                    <td className="px-3 py-2.5 text-center text-ink-4 text-[10px] font-mono">
                      {scores.map((s, i) => (
                        <span key={i} className={`mx-0.5 ${s === best ? 'text-emerald-500 font-bold' : 'text-ink-4'}`}>
                          {deltaIndicator(s, best)}
                        </span>
                      ))}
                    </td>
                  )}
                </tr>
              )
            })}
            {/* Impact Subtotal */}
            <tr className="border-b-2 border-rule bg-surface-hover/30">
              <td className="px-4 py-3 text-amethyst-violet font-bold text-[11px]">
                SUBTOTALE
              </td>
              {enabled.map((init, i) => {
                const score = calculateImpact(init.impact)
                return (
                  <td key={i} className="px-3 py-3 text-center">
                    <span className="text-amethyst-violet font-black text-base">
                      {score.toFixed(1)}
                    </span>
                    <span className="text-ink-4 text-[9px]">/25</span>
                  </td>
                )
              })}
              {enabled.length > 1 && <td />}
            </tr>

            {/* Composite Score */}
            <tr className="bg-gradient-to-r from-electric-cyan/5 to-amethyst-violet/5">
              <td className="px-4 py-3 font-black text-[11px] text-ink uppercase tracking-wider">
                Score Composito
              </td>
              {enabled.map((init, i) => {
                const f = calculateFeasibility(init.feasibility)
                const imp = calculateImpact(init.impact)
                const composite = Math.round(((f / 35) * 50 + (imp / 25) * 50))
                return (
                  <td key={i} className="px-3 py-3 text-center">
                    <span className="text-ink font-black text-lg">{composite}</span>
                    <span className="text-ink-4 text-[9px]">/100</span>
                  </td>
                )
              })}
              {enabled.length > 1 && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComparisonTable
