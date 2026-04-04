import styles from './LayoutPicker.module.css'

export function LayoutPicker({
  layouts,
  selectedLayout,
  orientation,
  onSelectLayout,
  onSetOrientation,
}) {
  return (
    <div className={styles.container}>
      <p className={styles.placeholder}>Layout Picker</p>
    </div>
  )
}
