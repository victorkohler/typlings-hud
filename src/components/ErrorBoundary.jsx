import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className="flex flex-col items-center justify-center h-screen px-(--spacing-xl) text-center bg-(--color-bg-warm) text-(--color-text-primary)"
        style={{ height: '100dvh' }}
      >
        <p className="text-lg font-medium mb-(--spacing-sm)">Something went wrong</p>
        <p className="text-sm text-(--color-text-secondary) mb-(--spacing-xl)">The configurator ran into an unexpected error.</p>
        <button
          className="px-(--spacing-xl) py-(--spacing-md) border-none rounded-(--radius-pill) bg-(--color-accent) text-(--color-white) text-sm uppercase tracking-[1px] cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    )
  }
}
