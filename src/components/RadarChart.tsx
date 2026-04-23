"use client"

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { useThemeStore } from '@/store/useThemeStore'

const AXES = [
  { key: 'technicalMaturity', label: 'Maturità Tecn.', group: 'feasibility' },
  { key: 'infrastructure', label: 'Infrastruttura', group: 'feasibility' },
  { key: 'dataConsistency', label: 'Coerenza Dati', group: 'feasibility' },
  { key: 'regulation', label: 'Regolamentaz.', group: 'feasibility' },
  { key: 'ethics', label: 'Etica & Trasp.', group: 'feasibility' },
  { key: 'finance', label: 'Finanza', group: 'feasibility' },
  { key: 'competences', label: 'Competenze', group: 'feasibility' },
  { key: 'businessConsistency', label: 'Coerenza Bus.', group: 'impact' },
  { key: 'economicImpact', label: 'Imp. Economico', group: 'impact' },
  { key: 'organizationalImpact', label: 'Imp. Organizz.', group: 'impact' },
  { key: 'clientImpact', label: 'Imp. Clienti', group: 'impact' },
  { key: 'learningImpact', label: 'Apprendimento', group: 'impact' },
]

const RadarChart: React.FC<{ className?: string }> = ({ className }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const initiatives = useAssessmentStore((s) => s.initiatives)
  const isDark = useThemeStore((s) => s.isDark)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 500
    const height = 500
    const margin = 80
    const radius = Math.min(width, height) / 2 - margin
    const levels = 5
    const total = AXES.length
    const angleSlice = (Math.PI * 2) / total

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    const rScale = d3.scaleLinear().domain([0, 5]).range([0, radius])

    // Read theme colors
    const style = getComputedStyle(document.documentElement)
    const gridColor = style.getPropertyValue('--matrix-grid').trim()
    const labelColor = style.getPropertyValue('--matrix-label').trim()
    const accentCyan = style.getPropertyValue('--electric-cyan').trim()
    const accentViolet = style.getPropertyValue('--amethyst-violet').trim()

    // Concentric grid levels
    for (let level = 1; level <= levels; level++) {
      const r = rScale(level)
      const points = AXES.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2
        return [r * Math.cos(angle), r * Math.sin(angle)] as [number, number]
      })

      g.append("polygon")
        .attr("points", points.map(p => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", gridColor)
        .attr("stroke-width", level === levels ? 1.5 : 0.5)
        .attr("stroke-dasharray", level === levels ? "none" : "2,3")
        .attr("opacity", 0.6)

      // Level number
      g.append("text")
        .attr("x", 5)
        .attr("y", -r - 4)
        .attr("fill", labelColor)
        .attr("font-size", "8px")
        .attr("opacity", 0.4)
        .text(level.toString())
    }

    // Radial axes + labels
    AXES.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      g.append("line")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", x).attr("y2", y)
        .attr("stroke", gridColor)
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3)

      // Labels
      const lr = radius + 22
      const lx = lr * Math.cos(angle)
      const ly = lr * Math.sin(angle)

      const deg = (angle * 180) / Math.PI
      let textAnchor = 'middle'
      if (deg > -80 && deg < 80) textAnchor = 'start'
      else if (deg > 100 || deg < -100) textAnchor = 'end'

      g.append("text")
        .attr("x", lx)
        .attr("y", ly)
        .attr("dy", "0.35em")
        .attr("text-anchor", textAnchor)
        .attr("fill", axis.group === 'feasibility' ? accentCyan : accentViolet)
        .attr("font-size", "9px")
        .attr("font-weight", "600")
        .attr("opacity", 0.85)
        .text(axis.label)
    })

    // Data polygons for each enabled initiative
    const enabledInits = initiatives.filter(init => init.enabled)
    enabledInits.forEach((init) => {
      const values = AXES.map((axis) => {
        if (axis.group === 'feasibility') {
          return (init.feasibility as Record<string, number>)[axis.key] || 3
        } else {
          return (init.impact as Record<string, number>)[axis.key] || 3
        }
      })

      const points = values.map((val, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const r = rScale(val)
        return [r * Math.cos(angle), r * Math.sin(angle)] as [number, number]
      })

      // Filled polygon
      g.append("polygon")
        .attr("points", points.map(p => p.join(",")).join(" "))
        .attr("fill", init.color)
        .attr("fill-opacity", 0.08)
        .attr("stroke", init.color)
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.8)
        .attr("stroke-linejoin", "round")

      // Data points
      points.forEach((point) => {
        g.append("circle")
          .attr("cx", point[0])
          .attr("cy", point[1])
          .attr("r", 3.5)
          .attr("fill", init.color)
          .attr("stroke", isDark ? '#0B0E14' : '#FFFFFF')
          .attr("stroke-width", 2)
      })
    })

    // Legend
    const legendG = svg.append("g")
      .attr("transform", `translate(${width - 15}, 20)`)

    enabledInits.forEach((init, i) => {
      const lg = legendG.append("g")
        .attr("transform", `translate(0, ${i * 22})`)

      lg.append("rect")
        .attr("x", -50).attr("y", -8)
        .attr("width", 55).attr("height", 16)
        .attr("rx", 4)
        .attr("fill", `${init.color}15`)
        .attr("stroke", `${init.color}30`)
        .attr("stroke-width", 0.5)

      lg.append("circle")
        .attr("cx", -42).attr("r", 3)
        .attr("fill", init.color)

      lg.append("text")
        .attr("x", -35).attr("dy", "0.35em")
        .attr("fill", labelColor)
        .attr("font-size", "8px")
        .attr("font-weight", "700")
        .text(init.name.substring(0, 12))
    })

  }, [initiatives, isDark])

  return (
    <div className={`relative bg-[var(--matrix-bg)] p-4 rounded-xl border border-rule shadow-[var(--shadow-card)] ${className}`}>
      <div className="relative" style={{ paddingBottom: '100%' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  )
}

export default RadarChart
