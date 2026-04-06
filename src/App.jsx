import { useSyncExternalStore } from 'react'
import DefaultShell from './variants/default/Shell'

const VARIANTS = {
  default: DefaultShell,
}

// Reads ?v= from the URL. Falls back to 'default'.
function getVariant() {
  return new URLSearchParams(window.location.search).get('v') || 'default'
}

// Re-render when the URL changes (back/forward navigation).
function subscribeToUrl(cb) {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}

export default function App() {
  const variantKey = useSyncExternalStore(subscribeToUrl, getVariant)
  const Shell = VARIANTS[variantKey]

  if (!Shell) {
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
        <h2>Unknown variant: <code>{variantKey}</code></h2>
        <p>Available: {Object.keys(VARIANTS).join(', ')}</p>
      </div>
    )
  }

  return <Shell />
}
