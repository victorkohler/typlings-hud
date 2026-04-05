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
      {/* Background color section — solids tint the poster's content-zone
          background (same surface the patterns tint). The first entry is the
          `none` sentinel, rendered as a white circle with a gray diagonal
          line. It's the pre-selected default so the poster starts with no
          background fill. */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Background color</span>
      </div>
      <div className={styles.swatchRow}>
        {solidColors.map((color) => {
          const isNone = color.id === 'none'
          return (
            <button
              key={color.id}
              type="button"
              aria-label={color.name}
              aria-pressed={selectedColor === color.id}
              className={`${styles.swatch} ${isNone ? styles.swatchNone : ''} ${selectedColor === color.id ? styles.selected : ''}`}
              style={isNone ? undefined : { background: color.hex }}
              onClick={() => onSelectColor(color.id)}
            />
          )
        })}
      </div>

      <hr className={styles.divider} />

      {/* Background pattern section */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Background pattern</span>
      </div>
      <div className={styles.swatchRow}>
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            aria-label={pattern.name}
            aria-pressed={selectedPattern === pattern.id}
            className={`${styles.swatch} ${selectedPattern === pattern.id ? styles.selected : ''}`}
            // Inline diagonal stripes mirror the pattern rendering in
            // PosterPreview's content zone so a swatch reads as a scaled-down
            // preview of what the poster background will look like.
            style={{
              background: `repeating-linear-gradient(45deg, ${pattern.hex} 0 3px, rgba(0, 0, 0, 0.08) 3px 6px)`,
            }}
            onClick={() => onSelectPattern(pattern.id)}
          />
        ))}
      </div>
    </div>
  )
}
