import { palette } from './palette'
import { seaLight, seaView } from './sea-config'

/** Mediodía cubierto: sol alto, luz difusa y sombra corta. */
export function SeaLight() {
  return (
    <>
      <color attach="background" args={[palette.sky]} />
      <fog attach="fog" args={[palette.sky, seaView.fogNear, seaView.fogFar]} />
      <ambientLight color={palette.sky} intensity={seaLight.ambientIntensity} />
      <hemisphereLight
        color={palette.sky}
        groundColor={palette.deepWater}
        intensity={seaLight.hemisphereIntensity}
      />
      <directionalLight
        color={palette.sky}
        intensity={seaLight.sunIntensity}
        position={seaLight.sunPosition}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={8}
        shadow-camera-far={seaLight.shadowFar}
        shadow-camera-left={-seaLight.shadowExtent}
        shadow-camera-right={seaLight.shadowExtent}
        shadow-camera-top={seaLight.shadowExtent}
        shadow-camera-bottom={-seaLight.shadowExtent}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
      />
    </>
  )
}
