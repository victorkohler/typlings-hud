import styles from './CartButton.module.css'

export function CartButton({ activeTab, totalPrice, hasProduct, onAction }) {
  return (
    <div className={styles.container}>
      <p className={styles.placeholder}>Cart Button</p>
    </div>
  )
}
