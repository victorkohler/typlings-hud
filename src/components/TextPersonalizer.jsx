// Maximum characters accepted in the poster text field. Tuned to 30 because
// longer strings start wrapping past the content zone in the poster preview
// regardless of layout, and one to three short words is the overwhelming
// case for personalized posters (names, dates, one-liners).
const MAX_TEXT_LENGTH = 30

export function TextPersonalizer({ text, onTextChange }) {
  // When re-focusing a non-empty textarea, Safari sometimes reports the
  // selection at (0, 0) on the first focus event, which visually drops the
  // caret at the start of the text. Defer until after the native tap-to-
  // position logic has run, then if the selection is still collapsed at the
  // start, move it to the end so continuing to type feels natural.
  const handleFocus = (e) => {
    const el = e.target
    setTimeout(() => {
      if (document.activeElement !== el) return
      if (el.value.length > 0 && el.selectionStart === 0 && el.selectionEnd === 0) {
        el.setSelectionRange(el.value.length, el.value.length)
      }
    }, 0)
  }

  // Defensive slice in case a paste event somehow bypasses `maxLength` (older
  // Android WebViews occasionally do). The native attribute still handles the
  // common typing case so the caret behaves correctly.
  const handleChange = (e) => {
    const next = e.target.value.toUpperCase().slice(0, MAX_TEXT_LENGTH)
    onTextChange(next)
  }

  return (
    <div className="p-(--spacing-lg)">
      <label
        className="block italic text-sm text-(--color-text-secondary) mb-(--spacing-sm)"
        htmlFor="personalize-text"
      >
        Write a name, a quote, a song lyric or anything else
      </label>
      <textarea
        id="personalize-text"
        className={[
          'w-full block min-h-[80px] p-[14px]',
          'border border-(--color-border-input) rounded-(--radius-md)',
          'bg-(--color-white) text-(--color-text-primary)',
          // 16px is the iOS Safari zoom-on-focus threshold — do not lower. Kept as a
          // raw value (not a --text-* token) to signal it's an intentional exception
          // to the UI chrome scale.
          'text-[16px] font-[inherit] leading-[1.4] tracking-[1px] uppercase',
          'resize-none',
          'transition-colors duration-(--duration-normal) ease-[ease]',
          '[-webkit-tap-highlight-color:transparent]',
          'focus:outline-none focus:border-(--color-accent)',
        ].join(' ')}
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        maxLength={MAX_TEXT_LENGTH}
        rows={3}
      />
      {/* Live character counter, right-aligned under the textarea. Secondary color so
          it reads as utility metadata, not primary content. `aria-live="polite"` on
          the element lets screen readers announce length changes without yanking
          focus. */}
      <div
        className="mt-(--spacing-xs) text-right text-xs text-(--color-text-secondary) tabular-nums"
        aria-live="polite"
      >
        {text.length}/{MAX_TEXT_LENGTH}
      </div>
    </div>
  )
}
