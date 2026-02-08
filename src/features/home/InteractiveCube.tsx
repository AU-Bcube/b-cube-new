'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────

type Vec3 = [number, number, number];
type Axis = 'x' | 'y' | 'z';

interface CubeletData {
  id: number;
  pos: Vec3;
}

// ── Helpers ──────────────────────────────────────────────────────

function rotatePos(p: Vec3, axis: Axis, d: 1 | -1): Vec3 {
  const [x, y, z] = p;
  switch (axis) {
    case 'x':
      return d === 1 ? [x, -z, y] : [x, z, -y];
    case 'y':
      return d === 1 ? [z, y, -x] : [-z, y, x];
    case 'z':
      return d === 1 ? [-y, x, z] : [y, -x, z];
  }
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function createCubelets(): CubeletData[] {
  const out: CubeletData[] = [];
  let id = 0;
  for (const x of [-1, 1])
    for (const y of [-1, 1])
      for (const z of [-1, 1]) {
        out.push({ id, pos: [x, y, z] });
        id++;
      }
  return out;
}

const FACE_DIRS = ['+x', '-x', '+y', '-y', '+z', '-z'] as const;

function getFaceTransform(dir: string, half: number): string {
  switch (dir) {
    case '+x':
      return `rotateY(90deg) translateZ(${half}px)`;
    case '-x':
      return `rotateY(-90deg) translateZ(${half}px)`;
    case '+y':
      return `rotateX(90deg) translateZ(${half}px)`;
    case '-y':
      return `rotateX(-90deg) translateZ(${half}px)`;
    case '+z':
      return `translateZ(${half}px)`;
    case '-z':
      return `rotateY(180deg) translateZ(${half}px)`;
    default:
      return '';
  }
}

function isOuterFace(pos: Vec3, dir: string): boolean {
  switch (dir) {
    case '+x':
      return pos[0] === 1;
    case '-x':
      return pos[0] === -1;
    case '+y':
      return pos[1] === 1;
    case '-y':
      return pos[1] === -1;
    case '+z':
      return pos[2] === 1;
    case '-z':
      return pos[2] === -1;
    default:
      return false;
  }
}

const OUTER_FACE_BG = 'hsla(210, 60%, 75%, 0.15)';

function applyFaceStyle(el: HTMLElement, outer: boolean) {
  if (outer) {
    el.style.background = OUTER_FACE_BG;
    el.style.boxShadow =
      'inset 0 0 0 1px rgba(255,255,255,0.25), inset 0 0 18px rgba(100,180,255,0.15)';
    el.style.backdropFilter = 'blur(8px)';
    el.style.setProperty('-webkit-backdrop-filter', 'blur(8px)');
  } else {
    el.style.background = 'rgba(8, 12, 25, 0.6)';
    el.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.3)';
    el.style.backdropFilter = 'none';
    el.style.setProperty('-webkit-backdrop-filter', 'none');
  }
}

// ── Logo config ─────────────────────────────────────────────────

const LOGO_CONFIG = [
  // +x face (right)
  { path: '/cube_logo/react.svg', face: '+x', pos: [1, 1, -1] as Vec3 },
  { path: '/cube_logo/Next.js.svg', face: '+x', pos: [1, 1, 1] as Vec3 },
  { path: '/cube_logo/Tailwind CSS.svg', face: '+x', pos: [1, -1, -1] as Vec3 },
  { path: '/cube_logo/typescript.svg', face: '+x', pos: [1, -1, 1] as Vec3 },
  // -x face (left)
  { path: '/cube_logo/HTML5.svg', face: '-x', pos: [-1, 1, 1] as Vec3 },
  { path: '/cube_logo/CSS3.svg', face: '-x', pos: [-1, 1, -1] as Vec3 },
  { path: '/cube_logo/Figma.svg', face: '-x', pos: [-1, -1, 1] as Vec3 },
  { path: '/cube_logo/python.svg', face: '-x', pos: [-1, -1, -1] as Vec3 },
  // +y face (top)
  { path: '/cube_logo/FastAPI.svg', face: '+y', pos: [-1, 1, -1] as Vec3 },
  { path: '/cube_logo/Spring.svg', face: '+y', pos: [1, 1, -1] as Vec3 },
  { path: '/cube_logo/Nest.js.svg', face: '+y', pos: [-1, 1, 1] as Vec3 },
  { path: '/cube_logo/docker.svg', face: '+y', pos: [1, 1, 1] as Vec3 },
  // -y face (bottom)
  { path: '/cube_logo/AWS.svg', face: '-y', pos: [-1, -1, 1] as Vec3 },
  { path: '/cube_logo/Redis.svg', face: '-y', pos: [1, -1, -1] as Vec3 },
  { path: '/cube_logo/Java.svg', face: '-y', pos: [1, -1, 1] as Vec3 },
  { path: '/cube_logo/mongodb.svg', face: '-y', pos: [-1, -1, -1] as Vec3 },
  // +z face (front)
  { path: '/cube_logo/MySQL.svg', face: '+z', pos: [-1, 1, 1] as Vec3 },
  { path: '/cube_logo/GitHub.svg', face: '+z', pos: [1, 1, 1] as Vec3 },
  { path: '/cube_logo/Cloudflare.svg', face: '+z', pos: [-1, -1, 1] as Vec3 },
  { path: '/cube_logo/Slack.svg', face: '+z', pos: [1, -1, 1] as Vec3 },
  // -z face (back)
  { path: '/cube_logo/Git.svg', face: '-z', pos: [-1, 1, -1] as Vec3 },
  { path: '/cube_logo/notion.svg', face: '-z', pos: [-1, -1, -1] as Vec3 },
  { path: '/cube_logo/NGINX (1).svg', face: '-z', pos: [1, 1, -1] as Vec3 },
  { path: '/cube_logo/Visual Studio Code (VS Code).svg', face: '-z', pos: [1, -1, -1] as Vec3 },
];

const LOGO_COLORS = LOGO_CONFIG.map((_, i) => {
  const hue = 200 + (i * 7) % 50; // 200~250 range (blue to indigo)
  const sat = 50 + (i * 3) % 30;  // 50~80%
  const lit = 55 + (i * 5) % 25;  // 55~80%
  return `hsla(${hue}, ${sat}%, ${lit}%, 0.2)`;
});

// ── Main Component ──────────────────────────────────────────────

export default function InteractiveCube() {
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState(170);

  useEffect(() => {
    setMounted(true);
    const up = () => setSize(window.innerWidth >= 768 ? 250 : 170);
    up();
    window.addEventListener('resize', up);
    return () => window.removeEventListener('resize', up);
  }, []);

  // Geometry (2x2)
  const gap = size * 0.04;
  const cubeletSize = (size - gap) / 2;
  const step = (cubeletSize + gap) / 2;
  const half = cubeletSize / 2;
  const faceRadius = cubeletSize * 0.08;
  const logoSize = cubeletSize;

  const geoRef = useRef({ step, half });
  geoRef.current = { step, half };

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeGroupRef = useRef<HTMLDivElement>(null);
  const cubeletRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const cubeletsRef = useRef(createCubelets());

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const clickPos = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: -25, y: 45 });
  const autoY = useRef(45);
  // eslint-disable-next-line react-hooks/purity
  const lastInteract = useRef(Date.now());

  const sliceRef = useRef<{
    axis: Axis;
    dir: 1 | -1;
    ids: Set<number>;
    start: number;
  } | null>(null);

  // Logo tracking — accumulates rotation to preserve image orientation
  const logoRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const logoDataRef = useRef<
    { cubeletId: number; key: string; face: string; rotStr: string }[]
  >([]);

  useEffect(() => {
    logoDataRef.current = LOGO_CONFIG.map((cfg, i) => {
      const c = cubeletsRef.current.find(
        (cb) =>
          cb.pos[0] === cfg.pos[0] &&
          cb.pos[1] === cfg.pos[1] &&
          cb.pos[2] === cfg.pos[2],
      )!;
      return { cubeletId: c.id, key: `logo_${i}`, face: cfg.face, rotStr: '' };
    });
  }, []);

  const doSlice = useCallback(() => {
    if (sliceRef.current) return;

    const axes: Axis[] = ['x', 'y', 'z'];
    const axis = axes[Math.floor(Math.random() * 3)];
    const layer = [-1, 1][Math.floor(Math.random() * 2)];
    const dir = (Math.random() > 0.5 ? 1 : -1) as 1 | -1;
    const ai = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;

    const ids = new Set<number>();
    for (const c of cubeletsRef.current) {
      if (c.pos[ai] === layer) ids.add(c.id);
    }

    sliceRef.current = { axis, dir, ids, start: performance.now() };
    lastInteract.current = Date.now();
  }, []);

  // Animation loop
  useEffect(() => {
    let rafId: number;
    let phaseTime = 0;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      phaseTime += dt * 0.6;

      const { step: s, half: h } = geoRef.current;

      if (!isDragging.current) {
        autoY.current += dt * 8;
        rot.current.x += (-25 - rot.current.x) * dt * 2;
        rot.current.y += (autoY.current - rot.current.y) * dt * 2;
      }

      const bobY = Math.sin(phaseTime) * 2;

      if (cubeGroupRef.current) {
        cubeGroupRef.current.style.transform = `translateY(${bobY}px) rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
      }

      // Slice animation
      const sl = sliceRef.current;
      let sliceRotStr = '';
      if (sl) {
        const rawAngle =
          easeInOutCubic(Math.min((now - sl.start) / 550, 1)) * 90 * sl.dir;
        const cssAngle = sl.axis === 'y' ? rawAngle : -rawAngle;
        sliceRotStr =
          sl.axis === 'x'
            ? `rotateX(${cssAngle}deg)`
            : sl.axis === 'y'
              ? `rotateY(${cssAngle}deg)`
              : `rotateZ(${cssAngle}deg)`;
      }

      // Update cubelet transforms
      for (const c of cubeletsRef.current) {
        const el = cubeletRefs.current.get(c.id);
        if (!el) continue;
        const base = `translate3d(${c.pos[0] * s}px,${-c.pos[1] * s}px,${c.pos[2] * s}px)`;
        el.style.transform =
          sl && sl.ids.has(c.id) ? `${sliceRotStr} ${base}` : base;
      }

      // Update logo transforms: cubeletTransform + accumulated rotation + original face offset
      for (const ld of logoDataRef.current) {
        const logoEl = logoRefs.current.get(ld.key);
        const cubeletEl = cubeletRefs.current.get(ld.cubeletId);
        if (!logoEl || !cubeletEl) continue;
        logoEl.style.transform = `${cubeletEl.style.transform} ${ld.rotStr}${getFaceTransform(ld.face, h + 1)}`;
      }

      // Slice completion
      if (sl) {
        const t = Math.min((now - sl.start) / 550, 1);
        if (t >= 1) {
          // Compute final slice rotation string
          const finalCssAngle = (sl.axis === 'y' ? 1 : -1) * 90 * sl.dir;
          const finalRotStr =
            sl.axis === 'x'
              ? `rotateX(${finalCssAngle}deg) `
              : sl.axis === 'y'
                ? `rotateY(${finalCssAngle}deg) `
                : `rotateZ(${finalCssAngle}deg) `;

          // Update cubelet positions + face styles
          for (const c of cubeletsRef.current) {
            if (!sl.ids.has(c.id)) continue;
            c.pos = rotatePos(c.pos, sl.axis, sl.dir);
            const el = cubeletRefs.current.get(c.id);
            if (el) {
              el.style.transform = `translate3d(${c.pos[0] * s}px,${-c.pos[1] * s}px,${c.pos[2] * s}px)`;
              for (let i = 0; i < el.children.length; i++) {
                const face = el.children[i] as HTMLElement;
                const dir = face.dataset.dir;
                if (dir) applyFaceStyle(face, isOuterFace(c.pos, dir));
              }
            }
          }

          // Accumulate rotation for affected logos + immediately sync transforms
          for (const ld of logoDataRef.current) {
            if (sl.ids.has(ld.cubeletId)) {
              ld.rotStr = finalRotStr + ld.rotStr;
            }
            const logoEl = logoRefs.current.get(ld.key);
            const cubeletEl = cubeletRefs.current.get(ld.cubeletId);
            if (logoEl && cubeletEl) {
              logoEl.style.transform = `${cubeletEl.style.transform} ${ld.rotStr}${getFaceTransform(ld.face, h + 1)}`;
            }
          }

          sliceRef.current = null;
        }
      }

      if (!sliceRef.current && Date.now() - lastInteract.current > 4000) {
        doSlice();
        lastInteract.current = Date.now() - 2000;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [doSlice]);

  // Pointer events on container
  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      clickPos.current = { x: e.clientX, y: e.clientY };
      lastInteract.current = Date.now();
      el.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      rot.current.y += (e.clientX - dragStart.current.x) * 0.5;
      rot.current.x -= (e.clientY - dragStart.current.y) * 0.5;
      dragStart.current = { x: e.clientX, y: e.clientY };
      lastInteract.current = Date.now();
    };
    const onUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      autoY.current = rot.current.y;
      el.style.cursor = 'grab';
      const dx = e.clientX - clickPos.current.x;
      const dy = e.clientY - clickPos.current.y;
      if (dx * dx + dy * dy < 25) doSlice();
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [doSlice, mounted]);

  if (!mounted) return null;

  return (
    <motion.div
      className="relative select-none"
      style={{ width: size * 1.6, height: size * 1.6, maxWidth: '100%' }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          perspective: `${size * 3}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
        }}>
        <div
          ref={cubeGroupRef}
          style={{ transformStyle: 'preserve-3d', width: 0, height: 0 }}>
          {/* Cubelets */}
          {cubeletsRef.current.map((c) => (
            <div
              key={c.id}
              ref={(el) => {
                if (el) cubeletRefs.current.set(c.id, el);
                else cubeletRefs.current.delete(c.id);
              }}
              style={{
                position: 'absolute',
                left: -half,
                top: -half,
                width: cubeletSize,
                height: cubeletSize,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transform: `translate3d(${c.pos[0] * step}px,${-c.pos[1] * step}px,${c.pos[2] * step}px)`,
              }}>
              {FACE_DIRS.map((dir) => {
                const outer = isOuterFace(c.pos, dir);
                return (
                  <div
                    key={dir}
                    data-dir={dir}
                    style={{
                      position: 'absolute',
                      width: cubeletSize,
                      height: cubeletSize,
                      transform: getFaceTransform(dir, half),
                      borderRadius: faceRadius,
                      background: outer
                        ? OUTER_FACE_BG
                        : 'rgba(8, 12, 25, 0.6)',
                      boxShadow: outer
                        ? 'inset 0 0 0 1px rgba(255,255,255,0.25), inset 0 0 18px rgba(100,180,255,0.15)'
                        : 'inset 0 0 10px rgba(0,0,0,0.3)',
                      backdropFilter: outer ? 'blur(8px)' : 'none',
                      WebkitBackdropFilter: outer ? 'blur(8px)' : 'none',
                      backfaceVisibility: 'hidden',
                    }}
                  />
                );
              })}
            </div>
          ))}

          {/* Logos — follow cubelets with accumulated rotation */}
          {LOGO_CONFIG.map((logo, i) => (
            <div
              key={`logo_${i}`}
              ref={(el) => {
                const k = `logo_${i}`;
                if (el) logoRefs.current.set(k, el);
                else logoRefs.current.delete(k);
              }}
              style={{
                position: 'absolute',
                left: -logoSize / 2,
                top: -logoSize / 2,
                width: logoSize,
                height: logoSize,
                transform: `translate3d(${logo.pos[0] * step}px,${-logo.pos[1] * step}px,${logo.pos[2] * step}px) ${getFaceTransform(logo.face, half + 1)}`,
                transformStyle: 'preserve-3d',
                pointerEvents: 'none',
                borderRadius: faceRadius,
                overflow: 'hidden',
                background: LOGO_COLORS[i],
              }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.path}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: 1,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
