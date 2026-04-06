import styles from './TextPersonalizer.module.css'

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
    <div className={styles.container}>
      <label className={styles.label} htmlFor="personalize-text">
        Write a name, a quote, a song lyric or anything else
      </label>
      <textarea
        id="personalize-text"
        className={styles.textarea}
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        maxLength={MAX_TEXT_LENGTH}
        rows={3}
      />
      <div className={styles.counter} aria-live="polite">
        {text.length}/{MAX_TEXT_LENGTH}
      </div>
    </div>
  )
}
