'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, RoundedBox } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import cubeMapping from './cubeMapping.json'
import styles from './HeroSection.module.css'

export type Keyword = 'Product' | 'Content' | 'Data' | 'Teamwork' | 'Network' | 'Tech'
type Side = 'front' | 'back' | 'top' | 'bottom' | 'right' | 'left'
type Axis = 'x' | 'y' | 'z'
type Layer = -0.5 | 0.5
type Direction = -1 | 1
type Vec3 = [number, number, number]
type Quat = [number, number, number, number]

export interface CubeRequest {
  id: number
  keyword: Keyword
}

interface Move {
  axis: Axis
  layer: Layer
  direction: Direction
}

interface StickerData {
  cubieId: string
  localFaceNormal: Vec3
  iconFile: string
}

interface CubieState {
  id: string
  solvedPosition: Vec3
  solvedQuaternion: Quat
  position: Vec3
  quaternion: Quat
  stickers: StickerData[]
}

interface DragState {
  startX: number
  startY: number
  normal: THREE.Vector3
  position: Vec3
}

interface FaceMapping {
  keyword: Keyword
  top_left: string
  top_right: string
  bottom_left: string
  bottom_right: string
}

const iconRoot = '/cube-icons'
const cubieSize = 0.94
const stickerSize = cubieSize * 0.72
const stickerOffset = cubieSize / 2 + 0.009
const axisIndex: Record<Axis, 0 | 1 | 2> = { x: 0, y: 1, z: 2 }
const axisVector: Record<Axis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
}
const sideNormal: Record<Side, Vec3> = {
  front: [0, 0, 1],
  back: [0, 0, -1],
  top: [0, 1, 0],
  bottom: [0, -1, 0],
  right: [1, 0, 0],
  left: [-1, 0, 0],
}
const keywordSide: Record<Keyword, Side> = {
  Product: 'front',
  Content: 'back',
  Data: 'top',
  Teamwork: 'bottom',
  Network: 'right',
  Tech: 'left',
}
const baseFaceRotation: Record<Side, THREE.Euler> = {
  front: new THREE.Euler(0, 0, 0),
  back: new THREE.Euler(0, Math.PI, 0),
  top: new THREE.Euler(Math.PI / 2, 0, 0),
  bottom: new THREE.Euler(-Math.PI / 2, 0, 0),
  right: new THREE.Euler(0, -Math.PI / 2, 0),
  left: new THREE.Euler(0, Math.PI / 2, 0),
}

const faces = cubeMapping.faces as Record<Side, FaceMapping>

function tileName(side: Side, [x, y, z]: Vec3) {
  const face = faces[side]
  if (side === 'front') return y > 0 ? (x < 0 ? face.top_left : face.top_right) : x < 0 ? face.bottom_left : face.bottom_right
  if (side === 'back') return y > 0 ? (x > 0 ? face.top_left : face.top_right) : x > 0 ? face.bottom_left : face.bottom_right
  if (side === 'top') return z < 0 ? (x < 0 ? face.top_left : face.top_right) : x < 0 ? face.bottom_left : face.bottom_right
  if (side === 'bottom') return z > 0 ? (x < 0 ? face.top_left : face.top_right) : x < 0 ? face.bottom_left : face.bottom_right
  if (side === 'right') return y > 0 ? (z > 0 ? face.top_left : face.top_right) : z > 0 ? face.bottom_left : face.bottom_right
  return y > 0 ? (z < 0 ? face.top_left : face.top_right) : z < 0 ? face.bottom_left : face.bottom_right
}

function isOuter(side: Side, [x, y, z]: Vec3) {
  return (
    (side === 'front' && z > 0) ||
    (side === 'back' && z < 0) ||
    (side === 'top' && y > 0) ||
    (side === 'bottom' && y < 0) ||
    (side === 'right' && x > 0) ||
    (side === 'left' && x < 0)
  )
}

const solvedCubies: CubieState[] = ([-0.5, 0.5] as Layer[]).flatMap((x) =>
  ([-0.5, 0.5] as Layer[]).flatMap((y) =>
    ([-0.5, 0.5] as Layer[]).map((z) => {
      const id = `${x}:${y}:${z}`
      const solvedPosition: Vec3 = [x, y, z]
      const solvedQuaternion: Quat = [0, 0, 0, 1]
      const stickers = (Object.keys(faces) as Side[])
        .filter((side) => isOuter(side, solvedPosition))
        .map(
          (side): StickerData => ({
            cubieId: id,
            localFaceNormal: sideNormal[side],
            iconFile: tileName(side, solvedPosition),
          }),
        )
      return {
        id,
        solvedPosition,
        solvedQuaternion,
        position: [...solvedPosition],
        quaternion: [...solvedQuaternion],
        stickers,
      }
    }),
  ),
)

const solvedStickerCount = solvedCubies.reduce((total, cubie) => total + cubie.stickers.length, 0)
console.assert(solvedCubies.length === 8 && solvedStickerCount === 24, 'B-CUBE solved data must contain 8 cubies and 24 stickers.')

function cloneSolvedCubies() {
  return solvedCubies.map((cubie) => ({
    ...cubie,
    solvedPosition: [...cubie.solvedPosition] as Vec3,
    solvedQuaternion: [...cubie.solvedQuaternion] as Quat,
    position: [...cubie.solvedPosition] as Vec3,
    quaternion: [...cubie.solvedQuaternion] as Quat,
    stickers: cubie.stickers.map((sticker) => ({ ...sticker, localFaceNormal: [...sticker.localFaceNormal] as Vec3 })),
  }))
}

function rotateCubies(cubies: CubieState[], move: Move) {
  const index = axisIndex[move.axis]
  const rotation = new THREE.Quaternion().setFromAxisAngle(axisVector[move.axis], move.direction * Math.PI / 2)

  return cubies.map((cubie) => {
    if (Math.abs(cubie.position[index] - move.layer) > 0.01) return cubie
    const position = new THREE.Vector3(...cubie.position).applyQuaternion(rotation)
    const quaternion = rotation.clone().multiply(new THREE.Quaternion(...cubie.quaternion)).normalize()
    return {
      ...cubie,
      position: [Math.round(position.x * 2) / 2, Math.round(position.y * 2) / 2, Math.round(position.z * 2) / 2] as Vec3,
      quaternion: quaternion.toArray() as Quat,
    }
  })
}

function sideFromNormal(normal: THREE.Vector3): Side {
  const values = [Math.abs(normal.x), Math.abs(normal.y), Math.abs(normal.z)]
  const major = values.indexOf(Math.max(...values))
  if (major === 0) return normal.x > 0 ? 'right' : 'left'
  if (major === 1) return normal.y > 0 ? 'top' : 'bottom'
  return normal.z > 0 ? 'front' : 'back'
}

function keywordForIcon(iconFile: string) {
  return (Object.keys(faces) as Side[]).find((side) =>
    Object.values(faces[side]).some((value) => typeof value === 'string' && value === iconFile),
  )
}

function faceKeywords(cubies: CubieState[]) {
  const result = Object.fromEntries((Object.keys(faces) as Side[]).map((side) => [side, [] as Side[]])) as Record<Side, Side[]>
  cubies.forEach((cubie) => {
    const quaternion = new THREE.Quaternion(...cubie.quaternion)
    cubie.stickers.forEach((sticker) => {
      const worldSide = sideFromNormal(new THREE.Vector3(...sticker.localFaceNormal).applyQuaternion(quaternion))
      const keyword = keywordForIcon(sticker.iconFile)
      if (keyword) result[worldSide].push(keyword)
    })
  })
  return result
}

function isThoroughlyMixed(cubies: CubieState[]) {
  return Object.values(faceKeywords(cubies)).every((keywords) => keywords.length === 4 && new Set(keywords).size > 1)
}

function createShuffle() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const moves: Move[] = []
    let state = cloneSolvedCubies()
    while (moves.length < 14) {
      const move: Move = {
        axis: (['x', 'y', 'z'] as Axis[])[Math.floor(Math.random() * 3)],
        layer: (Math.random() < 0.5 ? -0.5 : 0.5) as Layer,
        direction: (Math.random() < 0.5 ? -1 : 1) as Direction,
      }
      const previous = moves.at(-1)
      if (previous && previous.axis === move.axis && previous.layer === move.layer) continue
      moves.push(move)
      state = rotateCubies(state, move)
    }
    if (isThoroughlyMixed(state)) return moves
  }
  return [
    { axis: 'x', layer: -0.5, direction: 1 },
    { axis: 'y', layer: 0.5, direction: -1 },
    { axis: 'z', layer: -0.5, direction: 1 },
    { axis: 'x', layer: 0.5, direction: -1 },
    { axis: 'y', layer: -0.5, direction: 1 },
    { axis: 'z', layer: 0.5, direction: 1 },
    { axis: 'x', layer: -0.5, direction: -1 },
    { axis: 'y', layer: 0.5, direction: 1 },
    { axis: 'z', layer: -0.5, direction: -1 },
    { axis: 'x', layer: 0.5, direction: 1 },
    { axis: 'y', layer: -0.5, direction: -1 },
    { axis: 'z', layer: 0.5, direction: -1 },
    { axis: 'x', layer: -0.5, direction: 1 },
    { axis: 'y', layer: 0.5, direction: -1 },
  ] satisfies Move[]
}

const textureCache = new Map<string, THREE.Texture>()
const failedTextures = new Set<string>()

function useIconTexture(iconFile: string) {
  const { gl } = useThree()
  const [loadedTexture, setTexture] = useState<THREE.Texture | null>(null)
  const texture = textureCache.get(iconFile) ?? loadedTexture

  useEffect(() => {
    let active = true
    if (textureCache.has(iconFile) || failedTextures.has(iconFile)) return

    new THREE.TextureLoader().load(
      `${iconRoot}/${iconFile}`,
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace
        loaded.generateMipmaps = true
        loaded.minFilter = THREE.LinearMipmapLinearFilter
        loaded.magFilter = THREE.LinearFilter
        loaded.anisotropy = gl.capabilities.getMaxAnisotropy()
        loaded.needsUpdate = true
        textureCache.set(iconFile, loaded)
        if (active) setTexture(loaded)
      },
      undefined,
      () => {
        if (!failedTextures.has(iconFile)) console.warn(`[B-CUBE] Failed to load icon texture: ${iconFile}`)
        failedTextures.add(iconFile)
      },
    )
    return () => {
      active = false
    }
  }, [gl, iconFile])

  return texture
}

function Sticker({ sticker }: { sticker: StickerData }) {
  const texture = useIconTexture(sticker.iconFile)
  const normal = useMemo(() => new THREE.Vector3(...sticker.localFaceNormal), [sticker.localFaceNormal])
  const position = useMemo(() => normal.clone().multiplyScalar(stickerOffset).toArray() as Vec3, [normal])
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal).toArray() as Quat,
    [normal],
  )

  if (!texture) return null
  return (
    <mesh position={position} quaternion={quaternion} renderOrder={5}>
      <planeGeometry args={[stickerSize, stickerSize]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.04}
        depthWrite
        side={THREE.FrontSide}
        toneMapped={false}
      />
    </mesh>
  )
}

function Cubie({ cubie, onStart }: { cubie: CubieState; onStart: (event: any, cubie: CubieState) => void }) {
  return (
    <group position={cubie.position} quaternion={cubie.quaternion} onPointerDown={(event) => onStart(event, cubie)}>
      <RoundedBox args={[cubieSize, cubieSize, cubieSize]} radius={0.045} smoothness={3} renderOrder={0}>
        <meshPhysicalMaterial
          color="#749fd8"
          transparent
          opacity={0.72}
          transmission={0.12}
          roughness={0.2}
          metalness={0.02}
          clearcoat={0.8}
          clearcoatRoughness={0.18}
          depthWrite
        />
      </RoundedBox>
      {cubie.stickers.map((sticker) => (
        <Sticker key={`${sticker.cubieId}:${sticker.iconFile}`} sticker={sticker} />
      ))}
    </group>
  )
}

function targetCubeQuaternion(keyword: Keyword) {
  const base = new THREE.Quaternion().setFromEuler(baseFaceRotation[keywordSide[keyword]])
  const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(20), 0))
  return tilt.multiply(base)
}

function CubeScene({
  request,
  onBusyChange,
  onSettled,
  onUserMove,
}: {
  request: CubeRequest | null
  onBusyChange: (busy: boolean) => void
  onSettled: (keyword: Keyword) => void
  onUserMove: () => void
}) {
  const root = useRef<THREE.Group>(null)
  const controls = useRef<any>(null)
  const { camera } = useThree()
  const [cubies, setCubies] = useState<CubieState[]>(cloneSolvedCubies)
  const cubiesRef = useRef(cubies)
  const moveHistory = useRef<Move[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeAxis, setActiveAxis] = useState<Axis>('x')
  const activeAxisRef = useRef<Axis>('x')
  const activeLayerRef = useRef<Layer>(0.5)
  const [layerAngle, setLayerAngleState] = useState(0)
  const layerAngleRef = useRef(0)
  const [busy, setBusyState] = useState(true)
  const busyRef = useRef(true)
  const drag = useRef<DragState | null>(null)
  const dragAxisSign = useRef(1)
  const frame = useRef<number | null>(null)
  const callbacks = useRef({ onBusyChange, onSettled, onUserMove })
  callbacks.current = { onBusyChange, onSettled, onUserMove }

  const setLayerAngle = (angle: number) => {
    layerAngleRef.current = angle
    setLayerAngleState(angle)
  }

  const setBusy = (value: boolean) => {
    busyRef.current = value
    setBusyState(value)
    callbacks.current.onBusyChange(value)
  }

  const commitCubies = (next: CubieState[]) => {
    cubiesRef.current = next
    setCubies(next)
  }

  const animateAngle = (from: number, to: number, duration: number) =>
    new Promise<void>((resolve) => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        const eased = (1 - Math.cos(Math.PI * progress)) / 2
        setLayerAngle(THREE.MathUtils.lerp(from, to, eased))
        if (progress < 1) frame.current = requestAnimationFrame(tick)
        else resolve()
      }
      frame.current = requestAnimationFrame(tick)
    })

  const animateMove = async (move: Move, duration: number, record: boolean) => {
    const index = axisIndex[move.axis]
    const ids = cubiesRef.current.filter((cubie) => Math.abs(cubie.position[index] - move.layer) < 0.01).map((cubie) => cubie.id)
    activeAxisRef.current = move.axis
    activeLayerRef.current = move.layer
    setActiveAxis(move.axis)
    setSelectedIds(ids)
    setLayerAngle(0)
    await animateAngle(0, move.direction * Math.PI / 2, duration)
    await new Promise<void>((resolve) => {
      frame.current = requestAnimationFrame(() => resolve())
    })
    commitCubies(rotateCubies(cubiesRef.current, move))
    if (record) moveHistory.current.push(move)
    setSelectedIds([])
    setLayerAngle(0)
  }

  const animateRoot = (keyword: Keyword) =>
    new Promise<void>((resolve) => {
      if (!root.current) {
        resolve()
        return
      }
      controls.current?.reset()
      const from = root.current.quaternion.clone()
      const target = targetCubeQuaternion(keyword)
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 950)
        const eased = (1 - Math.cos(Math.PI * progress)) / 2
        root.current?.quaternion.copy(from.clone().slerp(target, eased))
        if (progress < 1) frame.current = requestAnimationFrame(tick)
        else resolve()
      }
      frame.current = requestAnimationFrame(tick)
    })

  useEffect(() => {
    root.current?.quaternion.copy(targetCubeQuaternion('Product'))
  }, [])

  useEffect(() => {
    const run = { cancelled: false }
    const timer = window.setTimeout(async () => {
      setBusy(true)
      const shuffle = createShuffle()
      for (const move of shuffle) {
        if (run.cancelled) return
        await animateMove(move, 120, true)
      }
      if (run.cancelled) return
      console.assert(isThoroughlyMixed(cubiesRef.current), 'B-CUBE shuffle should mix keywords on every face.')
      setBusy(false)
    }, 0)
    return () => {
      run.cancelled = true
      window.clearTimeout(timer)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
    // Initial shuffle runs exactly once after the StrictMode probe mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!request) return
    let cancelled = false
    const solveAndFace = async () => {
      if (busyRef.current) return
      setBusy(true)
      const undoMoves = [...moveHistory.current].reverse()
      for (const move of undoMoves) {
        if (cancelled) return
        await animateMove({ ...move, direction: -move.direction as Direction }, 210, false)
      }
      if (cancelled) return
      moveHistory.current = []
      const restored = cubiesRef.current.every((cubie) => {
        const solved = solvedCubies.find((item) => item.id === cubie.id)!
        return cubie.position.every((value, index) => Math.abs(value - solved.solvedPosition[index]) < 0.01)
      })
      console.assert(restored, 'B-CUBE move history should restore all cubies to solved positions.')
      const selectedSide = keywordSide[request.keyword]
      const selectedFaceIcons = faceKeywords(cubiesRef.current)[selectedSide]
      console.assert(
        selectedFaceIcons.length === 4 && selectedFaceIcons.every((iconSide) => iconSide === selectedSide),
        `B-CUBE ${request.keyword} face should contain its four mapped icons.`,
      )
      await new Promise((resolve) => window.setTimeout(resolve, 120))
      if (cancelled) return
      await animateRoot(request.keyword)
      if (cancelled) return
      callbacks.current.onSettled(request.keyword)
      setBusy(false)
    }
    void solveAndFace()
    return () => {
      cancelled = true
    }
    // Request id intentionally triggers each chip click, including repeated keywords.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id])

  const onStart = (event: any, cubie: CubieState) => {
    if (busyRef.current || event.nativeEvent.shiftKey) return
    event.stopPropagation()
    event.target.setPointerCapture(event.pointerId)
    const worldQuaternion = new THREE.Quaternion()
    event.object.getWorldQuaternion(worldQuaternion)
    drag.current = {
      startX: event.nativeEvent.clientX,
      startY: event.nativeEvent.clientY,
      normal: event.face.normal.clone().applyQuaternion(worldQuaternion).normalize(),
      position: cubie.position,
    }
  }

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const current = drag.current
      if (!current) return
      const dx = event.clientX - current.startX
      const dy = event.clientY - current.startY
      if (!selectedIds.length && Math.hypot(dx, dy) > 5) {
        const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
        const tangent = Math.abs(dx) > Math.abs(dy) ? cameraRight : cameraUp
        const candidate = tangent.clone().cross(current.normal)
        if (root.current) {
          const rootQuaternion = new THREE.Quaternion()
          root.current.getWorldQuaternion(rootQuaternion)
          candidate.applyQuaternion(rootQuaternion.invert())
        }
        const values = [Math.abs(candidate.x), Math.abs(candidate.y), Math.abs(candidate.z)]
        const major = values.indexOf(Math.max(...values)) as 0 | 1 | 2
        const axis = (['x', 'y', 'z'] as Axis[])[major]
        const layer = current.position[major] as Layer
        activeAxisRef.current = axis
        activeLayerRef.current = layer
        dragAxisSign.current = Math.sign(candidate.getComponent(major)) || 1
        setActiveAxis(axis)
        setSelectedIds(cubiesRef.current.filter((item) => Math.abs(item.position[major] - layer) < 0.01).map((item) => item.id))
      }
      if (selectedIds.length) {
        const amount = Math.abs(dx) > Math.abs(dy) ? dx : -dy
        setLayerAngle(THREE.MathUtils.clamp(amount * 0.012 * dragAxisSign.current, -Math.PI / 2, Math.PI / 2))
      }
    }

    const up = async () => {
      if (!drag.current) return
      drag.current = null
      if (!selectedIds.length) return
      setBusy(true)
      const target = Math.round(layerAngleRef.current / (Math.PI / 2)) * (Math.PI / 2)
      await animateAngle(layerAngleRef.current, target, 120)
      if (Math.abs(target) > 0.01) {
        const move: Move = {
          axis: activeAxisRef.current,
          layer: activeLayerRef.current,
          direction: Math.sign(target) as Direction,
        }
        commitCubies(rotateCubies(cubiesRef.current, move))
        moveHistory.current.push(move)
        callbacks.current.onUserMove()
      }
      setSelectedIds([])
      setLayerAngle(0)
      setBusy(false)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [camera, selectedIds])

  const selected = useMemo(() => new Set(selectedIds), [selectedIds])
  const rotation: Vec3 = [
    activeAxis === 'x' ? layerAngle : 0,
    activeAxis === 'y' ? layerAngle : 0,
    activeAxis === 'z' ? layerAngle : 0,
  ]

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[-4, 6, 7]} intensity={2.2} color="#dee5ff" />
      <pointLight position={[4, 2, 5]} intensity={7} distance={12} color="#7c9bf2" />
      <group scale={1.157}>
        <group ref={root}>
          <group rotation={rotation}>
            {cubies
              .filter((cubie) => selected.has(cubie.id))
              .map((cubie) => (
                <Cubie key={cubie.id} cubie={cubie} onStart={onStart} />
              ))}
          </group>
          {cubies
            .filter((cubie) => !selected.has(cubie.id))
            .map((cubie) => (
              <Cubie key={cubie.id} cubie={cubie} onStart={onStart} />
            ))}
        </group>
      </group>
      <OrbitControls
        ref={controls}
        makeDefault
        enabled={!busy}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  )
}

function RendererSetup() {
  const { gl, size } = useThree()

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    gl.setSize(size.width, size.height, false)
  }, [gl, size.height, size.width])

  return null
}

export default function ThreeCube({
  request,
  onBusyChange,
  onSettled,
  onUserMove,
}: {
  request: CubeRequest | null
  onBusyChange: (busy: boolean) => void
  onSettled: (keyword: Keyword) => void
  onUserMove: () => void
}) {
  return (
    <div className={styles.threeCube} aria-label="층별로 회전할 수 있는 B-CUBE 루빅스 큐브">
      <Canvas camera={{ position: [3.8, 3.2, 5.4], fov: 46 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <RendererSetup />
        <CubeScene
          request={request}
          onBusyChange={onBusyChange}
          onSettled={onSettled}
          onUserMove={onUserMove}
        />
      </Canvas>
    </div>
  )
}
