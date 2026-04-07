import styles from './DetailsPanel.module.css'
import sectionStyles from '../styles/sections.module.css'

function formatPrice(price) {
  return `${price}kr`
}

function formatDelta(delta) {
  if (delta === 0) return '+0kr'
  if (delta > 0) return `+${delta}kr`
  return `\u2212${Math.abs(delta)}kr`
}

export function DetailsPanel({
  product,
  selectedSize,
  selectedFrame,
  onSelectSize,
  onSelectFrame,
  flush = false,
}) {
  if (!product) return null

  const frameOption = product.options.find((o) => o.type === 'frame')
  const frameObj = frameOption ? frameOption.choices.find((f) => f.id === selectedFrame) : null
  const currentFramePrice = frameObj?.price ?? 0

  return (
    <div className={flush ? styles.containerFlush : styles.container}>
      {/* Size selector */}
      <div className={sectionStyles.sectionHeader}>
        <span className={sectionStyles.sectionLabel}>Select size</span>
        <button className={sectionStyles.sectionLink}>Size guide</button>
      </div>
      <div className={`${styles.sizeList} ${product.sizes.length > 3 ? styles.sizeListGrid : ''}`}>
        {product.sizes.map((size) => (
          <button
            key={size.label}
            className={`${styles.sizePill} ${selectedSize === size.label ? styles.selected : ''}`}
            onClick={() => onSelectSize(size.label)}
          >
            <span>{size.label}</span>
            <span className={styles.sizePrice}>{formatPrice(size.price)}</span>
          </button>
        ))}
      </div>

      <p className={styles.descriptionText}>
        {product.description}
      </p>

      {frameOption && (
        <>
          <hr className={sectionStyles.divider} />

          <div className={sectionStyles.sectionHeader}>
            <span className={sectionStyles.sectionLabel}>Select Frame</span>
            <button className={sectionStyles.sectionLink}>Our frames</button>
          </div>
          <div className={styles.frameRow}>
            {frameOption.choices.map((frame) => {
              const delta = frame.price - currentFramePrice
              return (
                <button
                  key={frame.id}
                  className={`${styles.frameCard} ${selectedFrame === frame.id ? styles.selected : ''}`}
                  onClick={() => onSelectFrame(frame.id)}
                >
                  <div className={styles.frameThumbnail} />
                  <div className={styles.frameName}>{frame.name}</div>
                  <div className={styles.framePriceDelta}>{formatDelta(delta)}</div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
