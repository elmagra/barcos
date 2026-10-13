import { palette } from './palette'
import {
  portBlueprints,
  seaLayout,
  seaPorts,
  type SeaPortPlacement,
} from './sea-config'
import { PortCrane } from './PortCrane'
import { PortPier } from './PortPier'
import { PortShed } from './PortShed'

function QuayFace({ width }: { width: number }) {
  const drop = seaLayout.coastTop - seaLayout.deckTop

  return (
    <mesh position={[0, -drop / 2, seaLayout.pierRoot / 2]} castShadow receiveShadow>
      <boxGeometry args={[width + 0.8, drop, seaLayout.pierRoot]} />
      <meshLambertMaterial color={palette.wood} />
    </mesh>
  )
}

function SeaPort({ port }: { port: SeaPortPlacement }) {
  const plan = portBlueprints[port.silhouette]

  return (
    <group position={port.position} rotation={[0, port.yaw, 0]}>
      <PortShed plan={plan.shed} />
      <QuayFace width={plan.pier.width} />
      <PortPier plan={plan.pier} />
      <PortCrane plan={plan.crane} />
    </group>
  )
}

/** Los tres puertos fijos, cada uno con otra silueta. */
export function SeaPorts() {
  return (
    <group>
      {seaPorts.map((port) => (
        <SeaPort key={port.id} port={port} />
      ))}
    </group>
  )
}
