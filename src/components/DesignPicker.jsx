import styles from './DesignPicker.module.css'

export function DesignPicker({
  solidColors,
  patterns,
  selectedColor,
  selectedPattern,
  onSelectColor,
  onSelectPattern,
}) {
  return (
    <div className={styles.container}>
      <p className={styles.placeholder}>Design Picker</p>
    </div>
  )
}
