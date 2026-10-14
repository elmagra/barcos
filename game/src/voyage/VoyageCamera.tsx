import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { berthView } from '../sea/berth-config'
import { poseForVoyage, type ShipPose } from '../sea/berth-pose'
import { useVoyageStore } from './voyage-store'

interface OrbitRig {
  enabled: boolean
}

const framedPosition = (pose: ShipPose) => {
  const forwardX = Math.sin(pose.yaw)
  const forwardZ = Math.cos(pose.yaw)
  const sideX = Math.cos(pose.yaw)
  const sideZ = -Math.sin(pose.yaw)
  return new THREE.Vector3(
    pose.x - forwardX * berthView.back + sideX * berthView.side,
    pose.y + berthView.height,
    pose.z - forwardZ * berthView.back + sideZ * berthView.side,
  )
}

const readOrbit = (controls: unknown): OrbitRig | null => {
  if (!controls || typeof controls !== 'object' || !('enabled' in controls)) {
    return null
  }
  return controls as OrbitRig
}

/** Acerca la cámara al casco cuando la salida ya dejó el muelle. */
export function VoyageCamera() {
  const store = useVoyageStore()
  const camera = useThree((state) => state.camera)
  const controls = useThree((state) => state.controls)
  const lookAt = useRef(new THREE.Vector3())
  const goal = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const orbit = readOrbit(controls)
    const state = store.getState()
    if (!state.hasLeftDock) {
      if (orbit) {
        orbit.enabled = true
      }
      return
    }
    if (orbit) {
      orbit.enabled = false
    }
    const pose = poseForVoyage(state)
    goal.current.copy(framedPosition(pose))
    const aim = lookAt.current
    aim.set(pose.x, pose.y + berthView.lookHeight, pose.z)
    const blend = 1 - Math.exp(-delta * 6)
    camera.position.lerp(goal.current, blend)
    camera.lookAt(aim)
  }, 1)

  return null
}
