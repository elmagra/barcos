import { useSyncExternalStore } from 'react'
import { portLabel } from '../sea/berth-config'
import { seaPorts } from '../sea/sea-config'
import { voyagePhase, type VoyageState } from './voyage-state'
import { useVoyageStore } from './voyage-store'

const statusLabel = (state: VoyageState) => {
  if (state.phase === voyagePhase.castingOff) {
    return 'Soltando amarras'
  }
  if (state.phase === voyagePhase.atSea) {
    return 'En el agua'
  }
  if (state.phase === voyagePhase.docking) {
    const destination = state.destinationPortId ?? ''
    return `Atracando en ${portLabel[destination] ?? destination}`
  }
  return `Amarrado en ${portLabel[state.portId] ?? state.portId}`
}

/** Botones de soltar amarras y de atracar en uno de los tres puertos. */
export function VoyageHud() {
  const store = useVoyageStore()
  const voyage = useSyncExternalStore(store.subscribe, store.getState, store.getState)
  const handleCastOff = () => {
    store.castOff()
  }

  return (
    <section className="voyage-hud" aria-label="Salida del muelle">
      <p className="voyage-status" role="status" data-voyage-phase={voyage.phase} data-voyage-port={voyage.portId}>
        {statusLabel(voyage)}
      </p>
      {voyage.phase === voyagePhase.moored ? (
        <button type="button" onClick={handleCastOff}>
          Soltar amarras
        </button>
      ) : null}
      {voyage.phase === voyagePhase.atSea
        ? seaPorts.map((port) => (
          <button key={port.id} type="button" onClick={() => store.dockAt(port.id)}>
            {`Atracar en ${portLabel[port.id] ?? port.id}`}
          </button>
        ))
        : null}
    </section>
  )
}
