import styles from './CartButton.module.css'

export function CartButton({ activeTab, totalPrice, hasProduct, productName, productConfirmed, onAction }) {
  const isProductTab = activeTab === 'product'
  const showProductCta = isProductTab && !productConfirmed
  const disabled = showProductCta && !hasProduct
  // Button text is uppercased via CSS `text-transform`, so we interpolate the
  // product name in its original case.
  const label = showProductCta
    ? `PERSONALIZE ${productName} - ${totalPrice}kr`
    : `ADD TO CART - ${totalPrice}kr`

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${showProductCta ? styles.product : styles.cart} ${disabled ? styles.disabled : ''}`}
        disabled={disabled}
        onClick={onAction}
        onMouseDown={(e) => e.currentTarget.classList.add(styles.pressed)}
        onMouseUp={(e) => e.currentTarget.classList.remove(styles.pressed)}
        onMouseLeave={(e) => e.currentTarget.classList.remove(styles.pressed)}
        onTouchStart={(e) => e.currentTarget.classList.add(styles.pressed)}
        onTouchEnd={(e) => e.currentTarget.classList.remove(styles.pressed)}
      >
        {label}
      </button>
    </div>
  )
}
