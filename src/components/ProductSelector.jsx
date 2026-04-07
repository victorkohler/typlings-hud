import styles from './ProductSelector.module.css'
import sectionStyles from '../styles/sections.module.css'

function formatPrice(price) {
  return `${price}kr`
}

function formatDelta(delta) {
  if (delta === 0) return '+0kr'
  if (delta > 0) return `+${delta}kr`
  return `\u2212${Math.abs(delta)}kr`
}

export function ProductSelector({
  products,
  selectedProduct,
  selectedSize,
  selectedFrame,
  onSelectProduct,
  onSelectSize,
  onSelectFrame,
  showOptions = true,
  columns = 3,
}) {
  const product = products.find((p) => p.id === selectedProduct)
  const frameOption = product?.options.find((o) => o.type === 'frame')
  const frameObj = frameOption ? frameOption.choices.find((f) => f.id === selectedFrame) : null
  const currentFramePrice = frameObj?.price ?? 0

  return (
    <div className={styles.container}>
      {/* Section title */}
      <h2 className={sectionStyles.sectionTitle}>Typling products</h2>

      {/* Product grid */}
      <div className={styles.productGrid} style={{ '--product-columns': columns }}>
        {products.map((p) => (
          <button
            key={p.id}
            className={`${styles.productCard} ${selectedProduct === p.id ? styles.selected : ''}`}
            onClick={() => onSelectProduct(p.id)}
          >
            <div className={styles.productThumbnail}>
              {p.thumbnail && (
                <img
                  src={p.thumbnail}
                  alt=""
                  className={styles.productImage}
                  decoding="async"
                  loading="eager"
                  draggable="false"
                  onLoad={(e) => {
                    const img = e.currentTarget
                    const reveal = () => img.classList.add(styles.loaded)
                    if (typeof img.decode === 'function') {
                      img.decode().then(reveal, reveal)
                    } else {
                      reveal()
                    }
                  }}
                />
              )}
            </div>
            <div className={styles.productLabel}>{p.name}</div>
          </button>
        ))}
      </div>

      {showOptions && <hr className={sectionStyles.divider} />}

      {showOptions && product && (
        <>
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

          {/* Product description (per-product, no price) */}
          <p className={styles.descriptionText}>
            {product.description}
          </p>

          {frameOption && (
            <>
              <hr className={sectionStyles.divider} />

              {/* Frame selector */}
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
        </>
      )}
    </div>
  )
}
