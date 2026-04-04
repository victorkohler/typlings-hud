import styles from './CartButton.module.css'

export function CartButton({ activeTab, totalPrice, hasProduct, productName, onAction }) {
  const isProductTab = activeTab === 'product'
  const disabled = isProductTab && !hasProduct
  // Button text is uppercased via CSS `text-transform`, so we interpolate the
  // product name in its original case.
  const label = isProductTab
    ? `PERSONALIZE ${productName} - ${totalPrice}kr`
    : `ADD TO CART - ${totalPrice}kr`

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${isProductTab ? styles.product : styles.cart} ${disabled ? styles.disabled : ''}`}
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
