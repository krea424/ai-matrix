"use client"

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { useThemeStore } from '@/store/useThemeStore'
import { calculateFeasibility, calculateImpact } from '@/lib/engine'

interface StrategicMatrixProps {
  className?: string
}

const StrategicMatrix: React.FC<StrategicMatrixProps> = ({ className }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const initiatives = useAssessmentStore((state) => state.initiatives)
  const activeIndex = useAssessmentStore((state) => state.activeIndex)
  const setActiveIndex = useAssessmentStore((state) => state.setActiveIndex)
  const isDark = useThemeStore((state) => state.isDark)

  // Constants
  const size = 600
  const margin = 60
  const innerSize = size - margin * 2

  const xScale = d3.scaleLinear().domain([0, 35]).range([0, innerSize])
  const yScale = d3.scaleLinear().domain([0, 25]).range([innerSize, 0])

  useEffect(() => {
    if (!svgRef.current) return

    // Read theme colors from CSS variables
    const style = getComputedStyle(document.documentElement)
    const matrixGrid = style.getPropertyValue('--matrix-grid').trim()
    const matrixLabel = style.getPropertyValue('--matrix-label').trim()
    const accentCyan = style.getPropertyValue('--electric-cyan').trim()
    const accentViolet = style.getPropertyValue('--amethyst-violet').trim()

    const zoneGreen0 = style.getPropertyValue('--zone-green-0').trim()
    const zoneGreen1 = style.getPropertyValue('--zone-green-1').trim()
    const zoneYellow = style.getPropertyValue('--zone-yellow').trim()
    const zoneRed0 = style.getPropertyValue('--zone-red-0').trim()
    const zoneRed1 = style.getPropertyValue('--zone-red-1').trim()

    const zoneColors = [
      [zoneYellow, zoneGreen0, zoneGreen1],
      [zoneRed0, zoneYellow, zoneGreen0],
      [zoneRed1, zoneRed0, zoneYellow],
    ]

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const g = svg.append("g")
      .attr("transform", `translate(${margin}, ${margin})`)

    const xThresholds = [0, 19, 28, 35]
    const yThresholds = [0, 12, 19, 25]

    // Zone backgrounds
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x1 = xScale(xThresholds[col])
        const x2 = xScale(xThresholds[col + 1])
        const y1 = yScale(yThresholds[row + 1])
        const y2 = yScale(yThresholds[row])
        g.append("rect")
          .attr("x", x1).attr("y", y1)
          .attr("width", x2 - x1).attr("height", y2 - y1)
          .attr("fill", zoneColors[2 - row][col])
          .attr("rx", 4)
      }
    }

    // Grid lines
    g.selectAll(".x-grid")
      .data(xThresholds).enter().append("line")
      .attr("x1", d => xScale(d)).attr("y1", 0)
      .attr("x2", d => xScale(d)).attr("y2", innerSize)
      .attr("stroke", matrixGrid).attr("stroke-width", 1.5)

    g.selectAll(".y-grid")
      .data(yThresholds).enter().append("line")
      .attr("x1", 0).attr("y1", d => yScale(d))
      .attr("x2", innerSize).attr("y2", d => yScale(d))
      .attr("stroke", matrixGrid).attr("stroke-width", 1.5)

    // Axis labels
    const labels = ["BASSO", "MEDIO", "ALTO"]
    const xLabelPositions = [9.5, 23.5, 31.5]
    g.selectAll(".x-label")
      .data(labels).enter().append("text")
      .attr("x", (_, i) => xScale(xLabelPositions[i]))
      .attr("y", innerSize + 30)
      .attr("text-anchor", "middle")
      .attr("fill", matrixLabel)
      .attr("font-size", "10px").attr("font-weight", "700").attr("letter-spacing", "0.15em")
      .text(d => d)

    const yLabelPositions = [6, 15.5, 22]
    g.selectAll(".y-label")
      .data(labels).enter().append("text")
      .attr("x", -30)
      .attr("y", (_, i) => yScale(yLabelPositions[i]))
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", (_, i) => `rotate(-90, -30, ${yScale(yLabelPositions[i])})`)
      .attr("fill", matrixLabel)
      .attr("font-size", "10px").attr("font-weight", "700").attr("letter-spacing", "0.15em")
      .text(d => d)

    // Axis titles
    svg.append("text")
      .attr("x", size / 2 + margin / 2).attr("y", size - 10)
      .attr("text-anchor", "middle")
      .attr("fill", accentCyan)
      .attr("font-size", "11px").attr("font-weight", "900").attr("letter-spacing", "0.2em")
      .text("FATTIBILITÀ TECNICA")

    svg.append("text")
      .attr("x", 15).attr("y", size / 2)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90, 15, ${size / 2})`)
      .attr("fill", accentViolet)
      .attr("font-size", "11px").attr("font-weight", "900").attr("letter-spacing", "0.2em")
      .text("IMPATTO DI BUSINESS")

  }, [xScale, yScale, innerSize, isDark])

  // Compute dot positions for all enabled initiatives
  const dots = initiatives.map((init, i) => {
    const fScore = calculateFeasibility(init.feasibility)
    const iScore = calculateImpact(init.impact)
    return {
      index: i,
      name: init.name,
      color: init.color,
      enabled: init.enabled,
      isActive: i === activeIndex,
      left: ((xScale(fScore) + margin) / size) * 100,
      top: ((yScale(iScore) + margin) / size) * 100,
    }
  })

  return (
    <div className={`relative bg-[var(--matrix-bg)] p-2 rounded-xl border border-rule shadow-[var(--shadow-card)] ${className}`}>
      <div className="relative" style={{ paddingBottom: '100%' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Initiative Dots */}
        {dots.filter(d => d.enabled).map((dot) => (
          <motion.div
            key={dot.index}
            initial={false}
            animate={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              scale: dot.isActive ? 1 : 0.85,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            onClick={() => setActiveIndex(dot.index)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group ${
              dot.isActive ? 'z-20' : 'z-10'
            }`}
            style={{ willChange: 'left, top' }}
          >
            {/* Glow ring */}
            <div
              className={`absolute inset-[-8px] rounded-full transition-opacity duration-300 ${
                dot.isActive ? 'opacity-100 animate-pulse' : 'opacity-40'
              }`}
              style={{ backgroundColor: `${dot.color}15` }}
            />
            {/* Main dot */}
            <div
              className={`relative rounded-full border-2 transition-all duration-300 ${
                dot.isActive
                  ? 'w-6 h-6 border-white/80 shadow-lg'
                  : 'w-4 h-4 border-white/40 group-hover:w-5 group-hover:h-5'
              }`}
              style={{
                backgroundColor: dot.color,
                boxShadow: `0 0 ${dot.isActive ? 20 : 10}px ${dot.color}60`,
              }}
            />
            {/* Label */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[9px] font-bold text-white whitespace-nowrap border shadow-lg transition-all duration-300 ${
                dot.isActive ? '-top-9 opacity-100' : '-top-7 opacity-0 group-hover:opacity-100'
              }`}
              style={{
                backgroundColor: isDark ? '#1A1D23ee' : '#111827ee',
                borderColor: `${dot.color}30`,
              }}
            >
              {dot.name || `Iniziativa ${dot.index + 1}`}
            </div>
          </motion.div>
        ))}

        {/* Connection lines between dots */}
        {dots.filter(d => d.enabled).length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {dots.filter(d => d.enabled).map((dot, i, arr) => {
              if (i === 0) return null
              const prev = arr[i - 1]
              return (
                <line
                  key={`line-${dot.index}`}
                  x1={`${prev.left}%`} y1={`${prev.top}%`}
                  x2={`${dot.left}%`} y2={`${dot.top}%`}
                  stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                  strokeWidth="1" strokeDasharray="4 4"
                />
              )
            })}
          </svg>
        )}
      </div>
    </div>
  )
}

export default StrategicMatrix
