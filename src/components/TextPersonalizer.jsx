import styles from './TextPersonalizer.module.css'

export function TextPersonalizer({ text, onTextChange }) {
  return (
    <div className={styles.container}>
      <p className={styles.placeholder}>Text Personalizer</p>
    </div>
  )
}
