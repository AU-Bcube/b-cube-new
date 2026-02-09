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

const FACE_SHADOW_OUTER =
  'inset 0 0 0 0.5px rgba(255,255,255,0.3), inset 0 0 20px rgba(100,170,255,0.15), 0 0 6px rgba(150,200,255,0.25), 0 0 20px rgba(80,140,255,0.1)';
const FACE_SHADOW_INNER =
  'inset 0 0 0 0.5px rgba(255,255,255,0.2), inset 0 0 14px rgba(100,160,255,0.2), 0 0 6px rgba(150,200,255,0.2), 0 0 18px rgba(80,140,255,0.08)';

function applyFaceStyle(el: HTMLElement, outer: boolean) {
  el.style.border = 'none';
  if (outer) {
    el.style.background = OUTER_FACE_BG;
    el.style.boxShadow = FACE_SHADOW_OUTER;
    el.style.backdropFilter = 'blur(8px)';
    el.style.setProperty('-webkit-backdrop-filter', 'blur(8px)');
  } else {
    el.style.background = 'rgba(60, 100, 180, 0.55)';
    el.style.boxShadow = FACE_SHADOW_INNER;
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
  {
    path: '/cube_logo/Visual Studio Code (VS Code).svg',
    face: '-z',
    pos: [1, -1, -1] as Vec3,
  },
];

// Face → two perpendicular rotation axes
const FACE_PERP_AXES: Record<string, [Axis, Axis]> = {
  '+x': ['y', 'z'],
  '-x': ['y', 'z'],
  '+y': ['x', 'z'],
  '-y': ['x', 'z'],
  '+z': ['x', 'y'],
  '-z': ['x', 'y'],
};

// CSS-space face centers (Y inverted from world)
const FACE_CENTERS: Record<string, Vec3> = {
  '+x': [1, 0, 0],
  '-x': [-1, 0, 0],
  '+y': [0, -1, 0],
  '-y': [0, 1, 0],
  '+z': [0, 0, 1],
  '-z': [0, 0, -1],
};

// CSS angular velocity for dir=1 (accounts for sign flip in animation)
const OMEGA_CSS: Record<Axis, Vec3> = {
  x: [-1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, -1],
};

/** Screen-space direction a face moves when rotating around `axis` with dir=1 */
function getScreenTangent(
  face: string,
  axis: Axis,
  rx: number,
  ry: number,
): [number, number] {
  const P = FACE_CENTERS[face];
  const w = OMEGA_CSS[axis];
  // v = ω × P (surface velocity in CSS object space)
  const vx = w[1] * P[2] - w[2] * P[1];
  const vy = w[2] * P[0] - w[0] * P[2];
  const vz = w[0] * P[1] - w[1] * P[0];
  // Project to screen: M = Rx(rx) * Ry(ry)
  const a = (rx * Math.PI) / 180;
  const b = (ry * Math.PI) / 180;
  const sa = Math.sin(a),
    ca = Math.cos(a);
  const sb = Math.sin(b),
    cb = Math.cos(b);
  return [cb * vx + sb * vz, sa * sb * vx + ca * vy - sa * cb * vz];
}

const LOGO_COLORS = LOGO_CONFIG.map((_, i) => {
  const hue = 200 + ((i * 7) % 50); // 200~250 range (blue to indigo)
  const sat = 50 + ((i * 3) % 30); // 50~80%
  const lit = 55 + ((i * 5) % 25); // 55~80%
  return `hsla(${hue}, ${sat}%, ${lit}%, 0.2)`;
});

// ── Main Component ──────────────────────────────────────────────

export default function InteractiveCube() {
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState(170);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoSlice, setAutoSlice] = useState(true);
  const autoRotateRef = useRef(true);
  const autoSliceRef = useRef(true);

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
    interactive?: boolean;
    dragAngle?: number;
    releaseTime?: number;
    releaseAngle?: number;
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

  const clickedCubeletId = useRef<number | null>(null);
  const clickedFaceDir = useRef<string | null>(null);
  const dragTangent = useRef<[number, number] | null>(null);

  const doSlice = useCallback(
    (preferredAxis?: Axis, preferredDir?: 1 | -1, preferredLayer?: number) => {
      if (sliceRef.current) return;

      const axis =
        preferredAxis ??
        (['x', 'y', 'z'] as Axis[])[Math.floor(Math.random() * 3)];
      const layer = preferredLayer ?? [-1, 1][Math.floor(Math.random() * 2)];
      const dir = preferredDir ?? ((Math.random() > 0.5 ? 1 : -1) as 1 | -1);
      const ai = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;

      const ids = new Set<number>();
      for (const c of cubeletsRef.current) {
        if (c.pos[ai] === layer) ids.add(c.id);
      }

      sliceRef.current = { axis, dir, ids, start: performance.now() };
      lastInteract.current = Date.now();
    },
    [],
  );

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

      if (!isDragging.current && autoRotateRef.current) {
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
        let rawAngle: number;
        if (sl.interactive) {
          // Interactive drag: angle follows cursor
          rawAngle = (sl.dragAngle ?? 0) * sl.dir;
        } else if (
          sl.releaseTime !== undefined &&
          sl.releaseAngle !== undefined
        ) {
          // Completing from release angle to 90
          const t = easeInOutCubic(Math.min((now - sl.releaseTime) / 300, 1));
          rawAngle = (sl.releaseAngle + (90 - sl.releaseAngle) * t) * sl.dir;
        } else {
          // Auto: full timed animation
          rawAngle =
            easeInOutCubic(Math.min((now - sl.start) / 550, 1)) * 90 * sl.dir;
        }
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
      if (sl && !sl.interactive) {
        const isRelease = sl.releaseTime !== undefined;
        const t = isRelease
          ? Math.min((now - sl.releaseTime!) / 300, 1)
          : Math.min((now - sl.start) / 550, 1);
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

      if (
        !sliceRef.current &&
        autoSliceRef.current &&
        Date.now() - lastInteract.current > 4000
      ) {
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

      // Detect which cubelet and face was clicked
      const target = e.target as HTMLElement;
      clickedCubeletId.current = null;
      clickedFaceDir.current = target.dataset.dir ?? null;
      for (const [id, cbEl] of cubeletRefs.current) {
        if (cbEl.contains(target)) {
          clickedCubeletId.current = id;
          break;
        }
      }
    };
    let wasShiftDrag = false;
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      if (e.shiftKey) {
        wasShiftDrag = true;
        rot.current.y += (e.clientX - dragStart.current.x) * 0.5;
        rot.current.x -= (e.clientY - dragStart.current.y) * 0.5;
        dragStart.current = { x: e.clientX, y: e.clientY };
      } else {
        const dx = e.clientX - clickPos.current.x;
        const dy = e.clientY - clickPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Start interactive slice when drag exceeds threshold
        if (!sliceRef.current && dist > 10) {
          const face = clickedFaceDir.current;
          const cubelet =
            clickedCubeletId.current !== null
              ? cubeletsRef.current.find(
                  (c) => c.id === clickedCubeletId.current,
                )
              : undefined;

          if (face && FACE_PERP_AXES[face]) {
            const [ax1, ax2] = FACE_PERP_AXES[face];
            const t1 = getScreenTangent(
              face,
              ax1,
              rot.current.x,
              rot.current.y,
            );
            const t2 = getScreenTangent(
              face,
              ax2,
              rot.current.x,
              rot.current.y,
            );
            const dot1 = dx * t1[0] + dy * t1[1];
            const dot2 = dx * t2[0] + dy * t2[1];

            let chosenAxis: Axis, dir: 1 | -1, tangent: [number, number];
            if (Math.abs(dot1) > Math.abs(dot2)) {
              chosenAxis = ax1;
              dir = dot1 > 0 ? 1 : -1;
              tangent = t1;
            } else {
              chosenAxis = ax2;
              dir = dot2 > 0 ? 1 : -1;
              tangent = t2;
            }

            const len = Math.sqrt(tangent[0] ** 2 + tangent[1] ** 2);
            dragTangent.current =
              len > 0.001 ? [tangent[0] / len, tangent[1] / len] : [1, 0];

            const ai = chosenAxis === 'x' ? 0 : chosenAxis === 'y' ? 1 : 2;
            const layer = cubelet
              ? cubelet.pos[ai]
              : [-1, 1][Math.floor(Math.random() * 2)];
            const ids = new Set<number>();
            for (const c of cubeletsRef.current) {
              if (c.pos[ai] === layer) ids.add(c.id);
            }
            sliceRef.current = {
              axis: chosenAxis,
              dir,
              ids,
              start: performance.now(),
              interactive: true,
              dragAngle: 0,
            };
          }
        }

        // Update drag angle by projecting onto tangent direction
        if (sliceRef.current?.interactive && dragTangent.current) {
          const proj =
            dx * dragTangent.current[0] + dy * dragTangent.current[1];
          sliceRef.current.dragAngle = Math.max(
            0,
            Math.min(proj * sliceRef.current.dir * 0.9, 90),
          );
        }
      }
      lastInteract.current = Date.now();
    };
    const onUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      autoY.current = rot.current.y;
      el.style.cursor = 'grab';

      if (wasShiftDrag) {
        wasShiftDrag = false;
        dragTangent.current = null;
        return;
      }

      // Release interactive slice → snap to 90°
      if (sliceRef.current?.interactive) {
        const angle = sliceRef.current.dragAngle ?? 0;
        if (angle > 15) {
          sliceRef.current.interactive = false;
          sliceRef.current.releaseAngle = angle;
          sliceRef.current.releaseTime = performance.now();
        } else {
          sliceRef.current = null;
        }
        dragTangent.current = null;
        return;
      }

      dragTangent.current = null;

      // Click → random slice
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
      className="group/cube relative select-none"
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
                        : 'rgba(60, 100, 180, 0.55)',
                      boxShadow: outer
                        ? FACE_SHADOW_OUTER
                        : FACE_SHADOW_INNER,
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

      {/* Controls — top-right, visible on hover */}
      <div className="pointer-events-none absolute right-1 top-1 flex flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover/cube:opacity-100">
        <button
          type="button"
          onClick={() => {
            const next = !autoRotate;
            setAutoRotate(next);
            autoRotateRef.current = next;
            if (next) autoY.current = rot.current.y;
          }}
          className="pointer-events-auto flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-white/40 transition-colors hover:text-white/60">
          <span
            className="flex h-3 w-3 shrink-0 items-center justify-center rounded border transition-all duration-150"
            style={{
              borderColor: autoRotate
                ? 'rgba(96,165,250,0.7)'
                : 'rgba(255,255,255,0.2)',
              background: autoRotate ? 'rgba(96,165,250,0.25)' : 'transparent',
            }}>
            {autoRotate && (
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="rgba(147,197,253,0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          자동 회전
        </button>
        <button
          type="button"
          onClick={() => {
            const next = !autoSlice;
            setAutoSlice(next);
            autoSliceRef.current = next;
          }}
          className="pointer-events-auto flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-white/40 transition-colors hover:text-white/60">
          <span
            className="flex h-3 w-3 shrink-0 items-center justify-center rounded border transition-all duration-150"
            style={{
              borderColor: autoSlice
                ? 'rgba(96,165,250,0.7)'
                : 'rgba(255,255,255,0.2)',
              background: autoSlice ? 'rgba(96,165,250,0.25)' : 'transparent',
            }}>
            {autoSlice && (
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="rgba(147,197,253,0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          자동 섞기
        </button>
      </div>

      {/* Hints — bottom-right, visible on hover */}
      <div className="pointer-events-none absolute bottom-2 right-1 flex flex-col items-end gap-0.5 opacity-0 transition-opacity duration-300 group-hover/cube:opacity-100">
        <span className="text-[9px] tracking-wide text-white/25">
          드래그 — 슬라이스
        </span>
        <span className="text-[9px] tracking-wide text-white/25">
          Shift + 드래그 — 회전
        </span>
      </div>
    </motion.div>
  );
}
