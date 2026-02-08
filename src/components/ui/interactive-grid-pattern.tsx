"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface InteractiveGridPatternProps {
  className?: string
  cellSize?: number
  glowColor?: string
  borderColor?: string
  proximity?: number
}

export function InteractiveGridPattern({
  className,
  cellSize = 36,
  glowColor = "rgba(81, 140, 255, 0.2)",
  borderColor = "rgba(26, 35, 64, 0.3)",
  proximity = 80,
}: InteractiveGridPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState({ rows: 0, cols: 0, scale: 1 })
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })

  const updateGrid = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const { width, height } = container.getBoundingClientRect()
    const scale = Math.max(1, Math.min(width, height) / 800)
    const scaledCellSize = cellSize * scale

    const cols = Math.ceil(width / scaledCellSize) + 1
    const rows = Math.ceil(height / scaledCellSize) + 1

    setGrid({ rows, cols, scale })
  }, [cellSize])

  useEffect(() => {
    updateGrid()
    const container = containerRef.current
    if (!container) return

    const ro = new ResizeObserver(updateGrid)
    ro.observe(container)
    return () => ro.disconnect()
  }, [updateGrid])

  // Window-level mouse tracking so component stays pointer-events-none
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-no-grid]")) {
        setMousePos({ x: -1000, y: -1000 })
        return
      }
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    const onLeave = () => {
      setMousePos({ x: -1000, y: -1000 })
    }
    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  const scaledCellSize = cellSize * grid.scale
  const scaledProximity = proximity * grid.scale

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0">
        {Array.from({ length: grid.rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {Array.from({ length: grid.cols }).map((_, colIndex) => {
              const index = rowIndex * grid.cols + colIndex
              const cellX = colIndex * scaledCellSize + scaledCellSize / 2
              const cellY = rowIndex * scaledCellSize + scaledCellSize / 2
              const dx = mousePos.x - cellX
              const dy = mousePos.y - cellY
              const distance = Math.sqrt(dx * dx + dy * dy)
              const proximityFactor = Math.max(0, 1 - distance / scaledProximity)
              const isHovered = distance < scaledCellSize / 2

              return (
                <div
                  key={index}
                  className="shrink-0 border transition-all ease-out"
                  style={{
                    width: scaledCellSize,
                    height: scaledCellSize,
                    borderColor: borderColor,
                    backgroundColor: isHovered
                      ? glowColor
                      : proximityFactor > 0
                        ? glowColor.replace(/[\d.]+\)$/, `${proximityFactor * 0.15})`)
                        : "transparent",
                    boxShadow: isHovered
                      ? `0 0 ${12 * grid.scale}px ${glowColor}`
                      : "none",
                    transitionDuration: isHovered ? "0ms" : "1000ms",
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(5,14,32,0.8) 100%)",
        }}
      />
    </div>
  )
}
