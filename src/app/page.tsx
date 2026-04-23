"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StrategicMatrix from '@/components/StrategicMatrix'
import VariableCard from '@/components/VariableCard'
import ScoreSummary from '@/components/ScoreSummary'
import ThemeToggle from '@/components/ThemeToggle'
import RadarChart from '@/components/RadarChart'
import ComparisonTable from '@/components/ComparisonTable'
import ExecutiveInsight from '@/components/ExecutiveInsight'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { feasibilityVariables, impactVariables, FeasibilityKey, ImpactKey } from '@/lib/variables'
import { FeasibilityInputs, ImpactInputs } from '@/lib/engine'
import { Sparkles, ChevronsUpDown, BarChart2, Edit3, Download, Copy, CheckCircle2 } from 'lucide-react'

type ViewMode = 'assessment' | 'report'

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('assessment')
  const [collapseKey, setCollapseKey] = useState(0)
  const [copied, setCopied] = useState(false)
  
  const initiatives = useAssessmentStore((s) => s.initiatives)
  const activeIndex = useAssessmentStore((s) => s.activeIndex)
  const setActiveIndex = useAssessmentStore((s) => s.setActiveIndex)
  const updateFeasibility = useAssessmentStore((s) => s.updateFeasibility)
  const updateImpact = useAssessmentStore((s) => s.updateImpact)

  const activeInit = initiatives[activeIndex]

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(initiatives, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `ai_assessment_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(initiatives, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-app text-ink flex flex-col font-sans selection:bg-electric-cyan/30">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ backgroundColor: 'var(--glow-cyan)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ backgroundColor: 'var(--glow-violet)' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-rule bg-app/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-cyan to-amethyst-violet flex items-center justify-center shadow-lg shadow-electric-cyan/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-[13px] font-black tracking-tight text-ink uppercase">AI IMPACT MATRIX</h1>
              <p className="text-[9px] font-medium text-ink-3 tracking-[0.2em] uppercase">
                SDA Bocconi Evaluation Framework
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle (Assessment / Report) */}
            <div className="flex bg-inset p-1 rounded-lg border border-rule shadow-inner">
              <button
                onClick={() => setViewMode('assessment')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'assessment'
                    ? 'bg-surface text-electric-cyan shadow-[var(--shadow-card)]'
                    : 'text-ink-3 hover:text-ink-2'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Assessment
              </button>
              <button
                onClick={() => setViewMode('report')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'report'
                    ? 'bg-surface text-amethyst-violet shadow-[var(--shadow-card)]'
                    : 'text-ink-3 hover:text-ink-2'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Executive Report
              </button>
            </div>

            <div className="h-6 w-px bg-rule mx-2" />

            {viewMode === 'assessment' && (
              <button
                onClick={() => setCollapseKey((k) => k + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-ink-3 hover:text-ink-2 hover:bg-surface-hover border border-transparent hover:border-rule transition-all mr-1"
                title="Chiudi tutte le variabili"
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chiudi tutto</span>
              </button>
            )}

            <button
              onClick={handleCopyJSON}
              className="p-2 text-ink-3 hover:text-ink-2 hover:bg-surface-hover rounded-lg transition-colors border border-transparent hover:border-rule"
              title="Copia dati (JSON)"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleExportJSON}
              className="p-2 text-ink-3 hover:text-ink-2 hover:bg-surface-hover rounded-lg transition-colors border border-transparent hover:border-rule"
              title="Esporta dati (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* ================= ASSESSMENT VIEW ================= */}
          {viewMode === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-[340px_1fr_340px] gap-8 items-start"
            >
              {/* LEFT PANEL — Impatto di Business */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amethyst-violet animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-ink uppercase">Impatto di Business</h2>
                  </div>
                  <button
                    onClick={() => setCollapseKey((k) => k + 1)}
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-ink-4 hover:text-ink-2 transition-colors"
                  >
                    <ChevronsUpDown className="w-3 h-3" /> Chiudi
                  </button>
                </div>

                <div className="space-y-2.5">
                  {impactVariables.map((variable, i) => (
                    <VariableCard
                      key={variable.key}
                      variable={variable}
                      value={activeInit.impact[variable.key as ImpactKey]}
                      onChange={(v) => updateImpact(variable.key as keyof ImpactInputs, v)}
                      accentColor="violet"
                      index={i}
                      collapseKey={collapseKey}
                    />
                  ))}
                </div>
              </div>

              {/* CENTER — Matrix & Feasibility */}
              <div className="flex flex-col items-center gap-8">
                {/* Visual Tabs for Matrix */}
                <div className="flex gap-2 p-1.5 bg-inset rounded-xl border border-rule mb-[-1rem] z-10">
                  {initiatives.map((init, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                        i === activeIndex
                          ? 'bg-surface shadow-[var(--shadow-card)] text-ink'
                          : 'text-ink-3 hover:text-ink-2 hover:bg-surface/50'
                      } ${!init.enabled ? 'opacity-40' : ''}`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: init.color }} />
                      <span className="truncate max-w-[120px]">{init.name || `Init ${i + 1}`}</span>
                    </button>
                  ))}
                </div>

                <StrategicMatrix className="w-full max-w-[650px] aspect-square" />

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse shadow-[0_0_8px_rgba(8,145,178,0.5)]" />
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-ink uppercase">Fattibilità Tecnica</h2>
                    <div className="flex-1 h-px bg-rule ml-4" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {feasibilityVariables.map((variable, i) => (
                      <VariableCard
                        key={variable.key}
                        variable={variable}
                        value={activeInit.feasibility[variable.key as FeasibilityKey]}
                        onChange={(v) => updateFeasibility(variable.key as keyof FeasibilityInputs, v)}
                        accentColor="cyan"
                        index={i}
                        collapseKey={collapseKey}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL — Score Summary */}
              <div className="sticky top-24">
                <ScoreSummary />
              </div>
            </motion.div>
          )}

          {/* ================= REPORT VIEW ================= */}
          {viewMode === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-[1200px] mx-auto space-y-8"
            >
              {/* Report Header */}
              <div className="text-center space-y-2 mb-12">
                <h2 className="text-3xl font-black tracking-tight text-ink">
                  Executive Briefing
                </h2>
                <p className="text-sm font-medium text-ink-3 max-w-2xl mx-auto">
                  Analisi comparativa multi-dimensionale del portafoglio AI. Insight strategici generati in tempo reale sulla base del framework SDA Bocconi.
                </p>
              </div>

              {/* Top Row: Matrix + Radar */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-ink-4 uppercase pl-2 border-l-2 border-electric-cyan">
                    Matrice Strategica
                  </h3>
                  <StrategicMatrix className="w-full aspect-square" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-ink-4 uppercase pl-2 border-l-2 border-amethyst-violet">
                    Profilo Dimensionale
                  </h3>
                  <RadarChart className="w-full aspect-square" />
                </div>
              </div>

              {/* Middle Section: Comparison Table */}
              <div className="space-y-4 pt-8">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-ink-4 uppercase pl-2 border-l-2 border-ink-3">
                  Scorecard Dettagliata
                </h3>
                <ComparisonTable className="w-full" />
              </div>

              {/* Bottom Section: Narrative AI */}
              <div className="space-y-4 pt-8 pb-12">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-ink-4 uppercase pl-2 border-l-2 border-transparent bg-gradient-to-b from-electric-cyan to-amethyst-violet bg-clip-border">
                  Sintesi Narrativa
                </h3>
                <div className="bg-gradient-to-r from-electric-cyan/20 to-amethyst-violet/20 p-[1px] rounded-xl shadow-2xl">
                  <ExecutiveInsight className="w-full bg-app rounded-xl" />
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
