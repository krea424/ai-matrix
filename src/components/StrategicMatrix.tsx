"use client"

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { useAssessmentStore } from '@/store/useAssessmentStore'

interface StrategicMatrixProps {
  className?: string
}

const StrategicMatrix: React.FC<StrategicMatrixProps> = ({ className }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const getFeasibilityScore = useAssessmentStore((state) => state.getFeasibilityScore)
  const getImpactScore = useAssessmentStore((state) => state.getImpactScore)

  // Constants
  const size = 600
  const margin = 60
  const innerSize = size - margin * 2
  
  // Score scales (Input range: Feasibility 0-35, Impact 0-25)
  // X-axis: Feasibility (Basso -> Alta)
  // Y-axis: Impact (Alto -> Basso for traditional matrix view)
  const xScale = d3.scaleLinear().domain([0, 35]).range([0, innerSize])
  const yScale = d3.scaleLinear().domain([0, 25]).range([innerSize, 0])

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear for re-render

    const g = svg.append("g")
      .attr("transform", `translate(${margin}, ${margin})`)

    // Draw Grid Lines (3x3)
    // Feasibility Thresholds: 19, 28
    // Impact Thresholds: 12, 19
    const xThresholds = [0, 19, 28, 35]
    const yThresholds = [0, 12, 19, 25]

    // Vertical lines
    g.selectAll(".x-grid")
      .data(xThresholds)
      .enter().append("line")
      .attr("class", "x-grid")
      .attr("x1", d => xScale(d))
      .attr("y1", 0)
      .attr("x2", d => xScale(d))
      .attr("y2", innerSize)
      .attr("stroke", "#1A1D23")
      .attr("stroke-width", 2)

    // Horizontal lines
    g.selectAll(".y-grid")
      .data(yThresholds)
      .enter().append("line")
      .attr("class", "y-grid")
      .attr("x1", 0)
      .attr("y1", d => yScale(d))
      .attr("x2", innerSize)
      .attr("y2", d => yScale(d))
      .attr("stroke", "#1A1D23")
      .attr("stroke-width", 2)

    // Axes Labels
    const labels = ["BASSO", "MEDIO", "ALTO"]
    
    // X Labels (Feasibility)
    const xLabelPositions = [9.5, 23.5, 31.5]
    g.selectAll(".x-label")
      .data(labels)
      .enter().append("text")
      .attr("x", (d, i) => xScale(xLabelPositions[i]))
      .attr("y", innerSize + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#6B7280")
      .attr("class", "text-[10px] font-bold tracking-widest")
      .text(d => d)

    // Y Labels (Impact)
    const yLabelPositions = [6, 15.5, 22]
    g.selectAll(".y-label")
      .data(labels)
      .enter().append("text")
      .attr("x", -30)
      .attr("y", (d, i) => yScale(yLabelPositions[i]))
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", (d, i) => `rotate(-90, -30, ${yScale(yLabelPositions[i])})`)
      .attr("fill", "#6B7280")
      .attr("class", "text-[10px] font-bold tracking-widest")
      .text(d => d)

    // Main Axis Titles
    svg.append("text")
      .attr("x", size / 2 + margin / 2)
      .attr("y", size - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#00F5FF")
      .attr("class", "text-xs font-black tracking-[0.2em]")
      .text("TECHNICAL FEASIBILITY")

    svg.append("text")
      .attr("x", 20)
      .attr("y", size / 2)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90, 20, ${size / 2})`)
      .attr("fill", "#BF40BF")
      .attr("class", "text-xs font-black tracking-[0.2em]")
      .text("BUSINESS IMPACT")

  }, [xScale, yScale, innerSize])

  const feasibilityScore = getFeasibilityScore()
  const impactScore = getImpactScore()

  return (
    <div className={`relative flex items-center justify-center bg-[#0B0E14] p-8 rounded-xl border border-[#1A1D23] ${className}`}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      />
      
      {/* Dynamic Initiative Dot */}
      <motion.div
        layoutId="initiative-dot"
        initial={false}
        animate={{
          x: xScale(feasibilityScore) + margin - 12,
          y: yScale(impactScore) + margin - 12,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#BF40BF] shadow-[0_0_20px_rgba(0,245,255,0.5)] border-2 border-white z-10 cursor-pointer"
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1D23] px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap border border-[#00F5FF]/30">
          INITIATIVE
        </div>
      </motion.div>
    </div>
  )
}

export default StrategicMatrix
