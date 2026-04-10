import { useSyncExternalStore } from 'react'
import DefaultShell from './variants/default/Shell'
import Version2Shell from './variants/version2/Shell'
import Version3Shell from './variants/version3/Shell'
import Version4Shell from './variants/version4/Shell'

const VARIANTS = {
  default: DefaultShell,
  version2: Version2Shell,
  version3: Version3Shell,
  version4: Version4Shell,
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
