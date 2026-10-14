import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useVoyageStore } from './voyage-store'

/** Reloj de la maniobra. En el agua no avanza solo. */
export function VoyageClock() {
  const store = useVoyageStore()

  useFrame((state, delta) => {
    store.advance(Math.min(delta, 0.05))
    const root = document.documentElement
    const frames = Number(root.dataset.frames ?? 0) + 1
    root.dataset.frames = String(frames)
    if (root.dataset.graph) {
      return
    }
    root.dataset.graph = 'wait'
  })

  useFrame((state) => {
    const root = document.documentElement
    if (root.dataset.graph !== 'wait') {
      return
    }
    const camera = state.camera
    root.dataset.calls = String(state.gl.info.render.calls)
    root.dataset.tris = String(state.gl.info.render.triangles)
    root.dataset.far = camera.far.toFixed(1)
    root.dataset.cam = [camera.position.x, camera.position.y, camera.position.z].map((value) => value.toFixed(1)).join(',')
    root.dataset.graph = 'done'
  }, -1)

  return null
}
