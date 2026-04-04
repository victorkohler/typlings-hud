import styles from './ProductSelector.module.css'

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
  return (
    <div className={styles.container}>
      <p className={styles.placeholder}>Product Selector</p>
    </div>
  )
}
