"use client";

import { useRef, useEffect } from "react";

export default function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const tick = () => {
      if (visible) {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        el.style.opacity = "1";
        el.style.background = `
          radial-gradient(350px circle at ${currentX}px ${currentY}px,
            rgba(100,165,255,0.14) 0%,
            rgba(81,140,255,0.06) 40%,
            transparent 70%),
          radial-gradient(800px circle at ${currentX}px ${currentY}px,
            rgba(60,120,240,0.06) 0%,
            rgba(40,90,200,0.02) 35%,
            transparent 60%)`;
      }
      animId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-700"
      style={{ opacity: 0 }}
    />
  );
}
