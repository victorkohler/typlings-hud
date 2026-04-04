import styles from './CartButton.module.css'

export function CartButton({ activeTab, totalPrice, hasProduct, onAction }) {
  const isProductTab = activeTab === 'product'
  const disabled = isProductTab && !hasProduct
  const label = isProductTab
    ? `SELECT PRODUCT - ${totalPrice}kr`
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
