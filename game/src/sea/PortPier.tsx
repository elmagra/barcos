import { palette } from './palette'
import { seaLayout, type PierPlan } from './sea-config'

function pierPostOffsets(length: number): number[] {
  const gap = 4.6
  const offsets: number[] = []
  let cursor = gap
  while (cursor < length - 1.2) {
    offsets.push(cursor)
    cursor += gap
  }
  return offsets
}

function PierPosts({ plan }: { plan: PierPlan }) {
  const deckCenterY = seaLayout.deckTop - seaLayout.coastTop - plan.thickness / 2
  const postHeight = seaLayout.deckTop - plan.thickness - seaLayout.waterLevel
  const postCenterY = deckCenterY - plan.thickness / 2 - postHeight / 2
  const offsets = pierPostOffsets(plan.length)

  return (
    <group>
      {offsets.flatMap((offsetZ) => [-1, 1].map((side) => (
        <mesh
          key={`${offsetZ}-${side}`}
          position={[side * plan.width * 0.32, postCenterY, seaLayout.pierRoot + offsetZ]}
          castShadow
        >
          <boxGeometry args={[0.28, postHeight, 0.28]} />
          <meshLambertMaterial color={palette.wood} />
        </mesh>
      )))}
    </group>
  )
}

/** Muelle de madera que entra al agua desde la costa. */
export function PortPier({ plan }: { plan: PierPlan }) {
  const deckCenterY = seaLayout.deckTop - seaLayout.coastTop - plan.thickness / 2
  const deckZ = seaLayout.pierRoot + plan.length / 2

  return (
    <group>
      <mesh position={[0, deckCenterY, deckZ]} castShadow receiveShadow>
        <boxGeometry args={[plan.width, plan.thickness, plan.length]} />
        <meshLambertMaterial color={palette.wood} />
      </mesh>
      <mesh position={[-plan.width / 2, deckCenterY + plan.thickness / 2 + 0.06, deckZ]}>
        <boxGeometry args={[0.14, 0.1, plan.length]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
      <mesh position={[plan.width / 2, deckCenterY + plan.thickness / 2 + 0.06, deckZ]}>
        <boxGeometry args={[0.14, 0.1, plan.length]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
      <PierPosts plan={plan} />
    </group>
  )
}
