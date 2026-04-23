"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useAssessmentStore, Initiative } from '@/store/useAssessmentStore'
import { calculateFeasibility, calculateImpact } from '@/lib/engine'
import { AlertTriangle, TrendingUp, Target, Lightbulb, Shield, Zap } from 'lucide-react'

const VAR_LABELS: Record<string, string> = {
  technicalMaturity: 'maturità tecnologica',
  infrastructure: 'coerenza infrastrutturale',
  dataConsistency: 'coerenza dei dati',
  regulation: 'adeguatezza regolamentare',
  ethics: 'etica e trasparenza',
  finance: 'compatibilità finanziaria',
  competences: 'disponibilità di competenze',
  businessConsistency: 'coerenza di business',
  economicImpact: 'impatto economico',
  organizationalImpact: 'impatto organizzativo',
  clientImpact: 'impatto sui clienti',
  learningImpact: 'impatto sull\'apprendimento',
}

interface ScoredInit {
  name: string
  color: string
  enabled: boolean
  fScore: number
  iScore: number
  composite: number
  weakestF: { key: string; value: number }
  weakestI: { key: string; value: number }
  strongestF: { key: string; value: number }
  strongestI: { key: string; value: number }
}

function scoreInitiatives(initiatives: Initiative[]): ScoredInit[] {
  return initiatives.filter(i => i.enabled).map((init) => {
    const fScore = calculateFeasibility(init.feasibility)
    const iScore = calculateImpact(init.impact)

    const fEntries = Object.entries(init.feasibility)
    const iEntries = Object.entries(init.impact)

    return {
      name: init.name,
      color: init.color,
      enabled: init.enabled,
      fScore,
      iScore,
      composite: Math.round(((fScore / 35) * 50 + (iScore / 25) * 50)),
      weakestF: fEntries.reduce((min, [k, v]) => (v as number) < min.value ? { key: k, value: v as number } : min, { key: '', value: 6 }),
      weakestI: iEntries.reduce((min, [k, v]) => (v as number) < min.value ? { key: k, value: v as number } : min, { key: '', value: 6 }),
      strongestF: fEntries.reduce((max, [k, v]) => (v as number) > max.value ? { key: k, value: v as number } : max, { key: '', value: 0 }),
      strongestI: iEntries.reduce((max, [k, v]) => (v as number) > max.value ? { key: k, value: v as number } : max, { key: '', value: 0 }),
    }
  })
}

function generateAnalysis(scored: ScoredInit[]) {
  if (scored.length === 0) {
    return {
      overview: 'Nessuna iniziativa attiva. Abilitare almeno un\'iniziativa per generare l\'analisi strategica.',
      findings: [] as { icon: React.ComponentType<any>; text: string; type: 'success' | 'warning' | 'info' }[],
      recommendation: '',
    }
  }

  const best = [...scored].sort((a, b) => b.composite - a.composite)[0]
  const worst = [...scored].sort((a, b) => a.composite - b.composite)[0]

  // === OVERVIEW ===
  let overview = ''
  if (scored.length === 1) {
    const s = scored[0]
    const fLevel = s.fScore < 19 ? 'basso' : s.fScore < 28 ? 'medio' : 'alto'
    const iLevel = s.iScore < 12 ? 'limitato' : s.iScore < 19 ? 'moderato' : 'significativo'
    overview = `L'iniziativa "${s.name}" presenta un profilo di fattibilità tecnica di livello ${fLevel} (${s.fScore.toFixed(1)}/35) e un impatto di business ${iLevel} (${s.iScore.toFixed(1)}/25), con uno score composito di ${s.composite}/100. `

    if (s.composite >= 70) {
      overview += 'L\'analisi conferma un posizionamento favorevole che giustifica l\'avvio di un progetto strutturato con allocazione dedicata di risorse.'
    } else if (s.composite >= 45) {
      overview += 'Il posizionamento intermedio suggerisce la necessità di un approccio graduale attraverso un progetto pilota a perimetro controllato.'
    } else {
      overview += 'Le criticità emerse richiedono un piano di mitigazione prima di procedere con investimenti significativi. Si raccomanda un assessment di dettaglio.'
    }
  } else {
    overview = `L'analisi comparativa del portafoglio AI (${scored.length} iniziative) evidenzia profili differenziati. `
    overview += `"${best.name}" emerge come l'iniziativa a maggior potenziale (score ${best.composite}/100), `
    if (scored.length > 1 && best.name !== worst.name) {
      const delta = best.composite - worst.composite
      overview += `con un differenziale di ${delta} punti rispetto a "${worst.name}" (${worst.composite}/100). `
    }
    overview += 'La matrice di prioritizzazione suggerisce una strategia di deployment sequenziale basata sui profili rischio-rendimento di ciascuna iniziativa.'
  }

  // === FINDINGS ===
  const findings: { icon: React.ComponentType<any>; text: string; type: 'success' | 'warning' | 'info' }[] = []

  // Risk flags (malus triggers)
  scored.forEach((s) => {
    if (s.weakestF.value <= 2) {
      findings.push({
        icon: AlertTriangle,
        text: `"${s.name}" — RISK FLAG: ${VAR_LABELS[s.weakestF.key] || s.weakestF.key} con score ${s.weakestF.value}/5. Penalizzazione malus attiva nel calcolo di fattibilità: peso variabile dimezzato.`,
        type: 'warning',
      })
    }
    if (s.weakestI.value <= 2) {
      findings.push({
        icon: AlertTriangle,
        text: `"${s.name}" — ALERT: ${VAR_LABELS[s.weakestI.key] || s.weakestI.key} al di sotto della soglia critica (${s.weakestI.value}/5). Necessario approfondimento su questa dimensione.`,
        type: 'warning',
      })
    }
  })

  // Best performer
  if (scored.length > 1) {
    findings.push({
      icon: TrendingUp,
      text: `"${best.name}" si posiziona come l'iniziativa prioritaria del portafoglio, con il miglior rapporto fattibilità-impatto (composito ${best.composite}/100).`,
      type: 'success',
    })
  }

  // Strategic patterns
  scored.forEach((s) => {
    if (s.fScore >= 28 && s.iScore < 12) {
      findings.push({
        icon: Zap,
        text: `"${s.name}" — QUICK WIN: alta fattibilità tecnica (${s.fScore.toFixed(1)}/35) ma impatto limitato. Ideale per generare early wins e costruire fiducia organizzativa nell'AI.`,
        type: 'info',
      })
    }
    if (s.fScore < 19 && s.iScore >= 19) {
      findings.push({
        icon: Lightbulb,
        text: `"${s.name}" — INVESTIMENTO STRATEGICO: alto impatto potenziale (${s.iScore.toFixed(1)}/25) ma fattibilità critica. Necessario un piano di capability building.`,
        type: 'info',
      })
    }
    if (s.strongestF.value === 5 && s.strongestI.value === 5) {
      findings.push({
        icon: Target,
        text: `"${s.name}" eccelle in ${VAR_LABELS[s.strongestF.key]} e ${VAR_LABELS[s.strongestI.key]}: leverages chiave per la value proposition.`,
        type: 'success',
      })
    }
  })

  // === RECOMMENDATION ===
  let recommendation = ''
  if (scored.length === 1) {
    const s = scored[0]
    if (s.composite >= 70) {
      recommendation = `RACCOMANDAZIONE: Procedere con implementazione full-scale per "${s.name}". Strutturare un business case dettagliato con ROI a 12-18 mesi, definire governance e KPI di monitoraggio. Timeline suggerita: kick-off entro 30 giorni.`
    } else if (s.composite >= 45) {
      recommendation = `RACCOMANDAZIONE: Avviare un Proof of Concept (PoC) per "${s.name}" della durata di 3-6 mesi, con gate review a metà percorso. Definire criteri go/no-go chiari e budget ring-fenced. Focus su mitigazione delle aree critiche identificate.`
    } else {
      recommendation = `RACCOMANDAZIONE: Rinviare l'investimento su "${s.name}". Condurre prima un assessment di dettaglio sulle aree a score ≤2 e definire un piano di mitigazione. Rivalutare in 6-12 mesi o quando le condizioni di fattibilità saranno migliorate.`
    }
  } else {
    recommendation = `RACCOMANDAZIONE PORTAFOGLIO: `
    const sorted = [...scored].sort((a, b) => b.composite - a.composite)
    recommendation += `1) Prioritizzare "${sorted[0].name}" (${sorted[0].composite}/100) per deployment immediato. `
    if (sorted.length >= 2) {
      recommendation += `2) ${sorted[1].composite >= 45 ? 'Avviare PoC parallelo' : 'Monitorare'} per "${sorted[1].name}" (${sorted[1].composite}/100). `
    }
    if (sorted.length >= 3) {
      recommendation += `3) ${sorted[2].composite >= 45 ? 'Valutare fase 2' : 'Posticipare e rivalutare'} per "${sorted[2].name}" (${sorted[2].composite}/100).`
    }
  }

  return { overview, findings, recommendation }
}

const ExecutiveInsight: React.FC<{ className?: string }> = ({ className }) => {
  const initiatives = useAssessmentStore((s) => s.initiatives)
  const scored = scoreInitiatives(initiatives)
  const { overview, findings, recommendation } = generateAnalysis(scored)

  return (
    <div className={`bg-[var(--matrix-bg)] rounded-xl border border-rule shadow-[var(--shadow-card)] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-rule bg-gradient-to-r from-electric-cyan/5 to-amethyst-violet/5">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-electric-cyan" />
          <div>
            <h3 className="text-xs font-black tracking-[0.2em] text-ink uppercase">
              Executive Brief
            </h3>
            <p className="text-[9px] text-ink-3 mt-0.5">
              Analisi strategica auto-generata • {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold tracking-[0.15em] text-ink-3 uppercase">
            Sintesi Esecutiva
          </h4>
          <p className="text-sm text-ink-2 leading-[1.8]">
            {overview}
          </p>
        </div>

        {/* Key Findings */}
        {findings.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.15em] text-ink-3 uppercase">
              Evidenze Chiave
            </h4>
            {findings.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-3 p-3.5 rounded-lg border ${
                  f.type === 'warning'
                    ? 'border-amber-500/20 bg-amber-500/5'
                    : f.type === 'success'
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-rule-soft bg-surface/50'
                }`}
              >
                <f.icon
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    f.type === 'warning' ? 'text-amber-500' :
                    f.type === 'success' ? 'text-emerald-500' :
                    'text-electric-cyan'
                  }`}
                />
                <span className="text-xs text-ink-2 leading-relaxed">{f.text}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Composite Scores Visual */}
        {scored.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.15em] text-ink-3 uppercase">
              Score Composito di Portafoglio
            </h4>
            <div className="space-y-2">
              {[...scored].sort((a, b) => b.composite - a.composite).map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-ink-2 w-28 truncate font-medium">{s.name}</span>
                  <div className="flex-1 bg-inset rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.composite}%` }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                    />
                  </div>
                  <span className="text-xs font-black text-ink tabular-nums w-10 text-right">
                    {s.composite}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {recommendation && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-electric-cyan/5 via-transparent to-amethyst-violet/5 border border-electric-cyan/15">
            <h4 className="text-[10px] font-bold tracking-[0.15em] text-electric-cyan uppercase mb-2">
              Raccomandazione Strategica
            </h4>
            <p className="text-xs text-ink font-medium leading-[1.8]">
              {recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExecutiveInsight
