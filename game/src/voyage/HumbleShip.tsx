import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { hullMeasure, mooringLayout } from '../sea/berth-config'
import { palette } from '../sea/palette'
import { cleatWorld, planFor, poseForVoyage, type WorldPoint } from '../sea/berth-pose'
import { seaPorts } from '../sea/sea-config'
import { ropesAreFast, ropePortId, type VoyageState } from './voyage-state'
import { useVoyageStore } from './voyage-store'

useGLTF.preload(hullMeasure.url)

const upAxis = new THREE.Vector3(0, 1, 0)
const ropeStart = new THREE.Vector3()
const ropeEnd = new THREE.Vector3()
const ropeDirection = new THREE.Vector3()

function HumbleHull() {
  const gltf = useGLTF(hullMeasure.url)
  const hull = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) {
        return
      }
      node.castShadow = true
      node.receiveShadow = true
    })
    return clone
  }, [gltf.scene])

  return <primitive object={hull} />
}

const placeRope = (mesh: THREE.Mesh, from: WorldPoint, to: WorldPoint) => {
  ropeStart.set(from.x, from.y, from.z)
  ropeEnd.set(to.x, to.y, to.z)
  ropeDirection.copy(ropeEnd).sub(ropeStart)
  const length = ropeDirection.length()
  if (length < 0.05) {
    mesh.visible = false
    return
  }
  ropeDirection.multiplyScalar(1 / length)
  mesh.visible = true
  mesh.position.copy(ropeStart).add(ropeEnd).multiplyScalar(0.5)
  mesh.position.y -= Math.min(0.2, length * 0.03)
  mesh.quaternion.setFromUnitVectors(upAxis, ropeDirection)
  mesh.scale.set(1, length, 1)
}

const applyMooring = (ropes: Array<THREE.Mesh | null>, state: VoyageState) => {
  const pose = poseForVoyage(state)
  const showRopes = ropesAreFast(state)
  const plan = planFor(ropePortId(state))
  mooringLayout.cleatAlong.forEach((along, index) => {
    const rope = ropes[index]
    const pier = plan.pierCleats[index]
    if (!rope || !pier) {
      return
    }
    if (!showRopes) {
      rope.visible = false
      return
    }
    placeRope(rope, cleatWorld(pose, plan.cleatSide, along), pier)
  })
  return pose
}

function Bollards() {
  const bollards = seaPorts.flatMap((port) => {
    return planFor(port.id).pierCleats.map((point, index) => ({
      key: `${port.id}-${index}`,
      point,
    }))
  })

  return (
    <group>
      {bollards.map((bollard) => (
        <mesh key={bollard.key} position={[bollard.point.x, bollard.point.y, bollard.point.z]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 0.7, 6]} />
          <meshLambertMaterial color={palette.wood} />
        </mesh>
      ))}
    </group>
  )
}

/** Casco humilde, bitas y amarras. Se mueve solo al zarpar o al atracar. */
export function HumbleShip() {
  const store = useVoyageStore()
  const hullRef = useRef<THREE.Group>(null)
  const ropeRefs = useRef<Array<THREE.Mesh | null>>([null, null, null])

  useFrame(() => {
    const hull = hullRef.current
    if (!hull) {
      return
    }
    const pose = applyMooring(ropeRefs.current, store.getState())
    hull.position.set(pose.x, pose.y, pose.z)
    hull.rotation.set(0, pose.yaw, 0)
  })

  return (
    <group>
      <group ref={hullRef}>
        <HumbleHull />
      </group>
      {mooringLayout.cleatAlong.map((along) => (
        <mesh
          key={along}
          ref={(node) => {
            const index = mooringLayout.cleatAlong.indexOf(along)
            ropeRefs.current[index] = node
          }}
          visible={false}
        >
          <cylinderGeometry args={[mooringLayout.ropeRadius, mooringLayout.ropeRadius, 1, 5]} />
          <meshLambertMaterial color={palette.wood} />
        </mesh>
      ))}
      <Bollards />
    </group>
  )
}
