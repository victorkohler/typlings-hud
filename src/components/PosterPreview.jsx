import styles from './PosterPreview.module.css'

export function PosterPreview({ text, layout, orientation, color, pattern, isExpanded }) {
  return (
    <div className={styles.container}>
      <p className={styles.placeholder}>Poster Preview</p>
    </div>
  )
}
