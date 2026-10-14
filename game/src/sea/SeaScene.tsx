import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, OrbitControls } from '@react-three/drei'
import { HumbleShip } from '../voyage/HumbleShip'
import { VoyageCamera } from '../voyage/VoyageCamera'
import { VoyageClock } from '../voyage/VoyageClock'
import { seaView } from './sea-config'
import { SeaLand } from './SeaLand'
import { SeaLight } from './SeaLight'
import { SeaPorts } from './SeaPorts'
import { SeaWater } from './SeaWater'

function FrameSea() {
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    const [x, y, z] = seaView.cameraPosition
    const [targetX, targetY, targetZ] = seaView.cameraTarget
    camera.position.set(x, y, z)
    camera.lookAt(targetX, targetY, targetZ)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

/** Un mar, la costa y los tres puertos en la misma vista. */
export function SeaScene() {
  return (
    <>
      <FrameSea />
      <SeaLight />
      <SeaWater />
      <SeaLand />
      <SeaPorts />
      <VoyageClock />
      <HumbleShip />
      <AdaptiveDpr />
      <AdaptiveEvents />
      <OrbitControls
        makeDefault
        target={seaView.cameraTarget}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={seaView.maxPolarAngle}
        minDistance={seaView.minDistance}
        maxDistance={seaView.maxDistance}
      />
      <VoyageCamera />
    </>
  )
}
