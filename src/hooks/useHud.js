import { useRef, useState } from 'react'

// iOS keyboard dismiss animation runs ~300ms end-to-end on recent devices.
// We wait for it to be 80–90% complete before kicking off the HUD/tab
// transition so the two animations don't overlap — overlapping reads as
// jittery on device. 280ms lands us at ~93% of the dismiss with a small
// safety margin before the HUD animation begins.
const KEYBOARD_DISMISS_MS = 300

// Shared HUD panel behavior: collapsed state, tab switching with same-tab
// toggle, and the iOS keyboard dismiss stagger. Every variant shell needs
// this — it's a platform workaround, not a UX decision.
export function useHud(activeTab, setActiveTab) {
  const [collapsed, setCollapsed] = useState(false)

  // Captures whether a textarea was focused at the *start* of a tab tap
  // (pointerdown), before Safari has a chance to move focus onto the button
  // and implicitly blur the textarea.
  const textareaWasFocusedRef = useRef(false)

  const handleTabPointerDown = () => {
    textareaWasFocusedRef.current = document.activeElement?.tagName === 'TEXTAREA'
  }

  // Tapping the active tab toggles collapse; tapping a different tab switches
  // and re-expands. If a textarea was focused, we defer the change behind the
  // keyboard dismiss animation so the two don't overlap.
  const handleTabChange = (nextTab) => {
    const apply = () => {
      if (nextTab === activeTab) {
        setCollapsed((prev) => !prev)
      } else {
        setCollapsed(false)
        setActiveTab(nextTab)
      }
    }

    if (textareaWasFocusedRef.current) {
      textareaWasFocusedRef.current = false
      const el = document.activeElement
      if (el && typeof el.blur === 'function') el.blur()
      setTimeout(apply, KEYBOARD_DISMISS_MS)
    } else {
      apply()
    }
  }

  const collapse = () => setCollapsed(true)

  return { collapsed, setCollapsed, handleTabChange, handleTabPointerDown, collapse }
}
