"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])
  return pos
}

export interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  color?: string
  vx?: number
  vy?: number
}

function hexToRgb(hex: string): number[] {
  let normalized = hex.replace("#", "")
  if (normalized.length === 3) {
    normalized = normalized.split("").map(c => c + c).join("")
  }
  const n = Number.parseInt(normalized, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface Circle {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
}

export function Particles({
  className,
  quantity = 80,
  staticity = 50,
  ease = 50,
  size = 0.4,
  color = "#518CFF",
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<Circle[]>([])
  const mousePosition = useMousePosition()
  const mouse = useRef({ x: 0, y: 0 })
  const canvasSize = useRef({ w: 0, h: 0 })
  const animationRef = useRef<number>(0)
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
  const rgb = hexToRgb(color)

  const circleParams = (): Circle => ({
    x: Math.floor(Math.random() * canvasSize.current.w),
    y: Math.floor(Math.random() * canvasSize.current.h),
    translateX: 0,
    translateY: 0,
    size: Math.floor(Math.random() * 2) + size,
    alpha: 0,
    targetAlpha: Number.parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
    dx: (Math.random() - 0.5) * 0.1,
    dy: (Math.random() - 0.5) * 0.1,
    magnetism: 0.1 + Math.random() * 4,
  })

  const drawCircle = (circle: Circle, update = false) => {
    if (!context.current) return
    context.current.translate(circle.translateX, circle.translateY)
    context.current.beginPath()
    context.current.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI)
    context.current.fillStyle = `rgba(${rgb.join(", ")}, ${circle.alpha})`
    context.current.fill()
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (!update) circles.current.push(circle)
  }

  const resizeCanvas = () => {
    if (!containerRef.current || !canvasRef.current || !context.current) return
    circles.current.length = 0
    canvasSize.current.w = containerRef.current.offsetWidth
    canvasSize.current.h = containerRef.current.offsetHeight
    canvasRef.current.width = canvasSize.current.w * dpr
    canvasRef.current.height = canvasSize.current.h * dpr
    canvasRef.current.style.width = `${canvasSize.current.w}px`
    canvasRef.current.style.height = `${canvasSize.current.h}px`
    context.current.scale(dpr, dpr)
  }

  const remapValue = (v: number, s1: number, e1: number, s2: number, e2: number) => {
    const r = ((v - s1) * (e2 - s2)) / (e1 - s1) + s2
    return r > 0 ? r : 0
  }

  const animate = () => {
    if (!context.current) return
    context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
    circles.current.forEach((circle, i) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapped = Number.parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2))
      if (remapped > 1) {
        circle.alpha += 0.02
        if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha
      } else {
        circle.alpha = circle.targetAlpha * remapped
      }
      circle.x += circle.dx + vx
      circle.y += circle.dy + vy
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease

      drawCircle(circle, true)

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1)
        drawCircle(circleParams())
      }
    })
    animationRef.current = window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (canvasRef.current) context.current = canvasRef.current.getContext("2d")
    resizeCanvas()
    for (let i = 0; i < quantity; i++) drawCircle(circleParams())
    animate()
    window.addEventListener("resize", () => { resizeCanvas(); for (let i = 0; i < quantity; i++) drawCircle(circleParams()) })
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [color])

  useEffect(() => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const { w, h } = canvasSize.current
    const x = mousePosition.x - rect.left - w / 2
    const y = mousePosition.y - rect.top - h / 2
    if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
      mouse.current.x = x
      mouse.current.y = y
    }
  }, [mousePosition.x, mousePosition.y])

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)}
    >
      <canvas className="absolute inset-0 size-full" ref={canvasRef} />
    </div>
  )
}
