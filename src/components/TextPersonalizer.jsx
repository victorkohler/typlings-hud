import styles from './TextPersonalizer.module.css'

export function TextPersonalizer({ text, onTextChange }) {
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
        rows={3}
        autoFocus
      />
    </div>
  )
}
