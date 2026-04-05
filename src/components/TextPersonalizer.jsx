import styles from './TextPersonalizer.module.css'

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

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="personalize-text">
        Write a name, a quote, a song lyric or anything else
      </label>
      <textarea
        id="personalize-text"
        className={styles.textarea}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onFocus={handleFocus}
        rows={3}
      />
    </div>
  )
}
