import styles from './ProductSelector.module.css'

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
  frames,
  selectedProduct,
  selectedSize,
  selectedFrame,
  onSelectProduct,
  onSelectSize,
  onSelectFrame,
}) {
  const product = products.find((p) => p.id === selectedProduct)
  const frameObj = frames.find((f) => f.id === selectedFrame)
  const currentFramePrice = frameObj?.price ?? 0

  return (
    <div className={styles.container}>
      {/* Section title */}
      <h2 className={styles.sectionTitle}>Typling products</h2>

      {/* Product grid */}
      <div className={styles.productGrid}>
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
                />
              )}
            </div>
            <div className={styles.productLabel}>{p.name}</div>
          </button>
        ))}
      </div>

      <hr className={styles.divider} />

      {product && (
        <>
          {/* Size selector */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Select size</span>
            <button className={styles.sectionLink}>Size guide</button>
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

          {product.supportsFrames && (
            <>
              <hr className={styles.divider} />

              {/* Frame selector */}
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>Select Frame</span>
                <button className={styles.sectionLink}>Our frames</button>
              </div>
              <div className={styles.frameRow}>
                {frames.map((frame) => {
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
