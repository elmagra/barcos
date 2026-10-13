import { Component, type ReactNode } from 'react'

interface SeaErrorBoundaryProps {
  children: ReactNode
}

interface SeaErrorBoundaryState {
  hasError: boolean
}

export class SeaErrorBoundary extends Component<SeaErrorBoundaryProps, SeaErrorBoundaryState> {
  state: SeaErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div className="sea-error">El mar no pudo mostrarse</div>
    }

    return this.props.children
  }
}
