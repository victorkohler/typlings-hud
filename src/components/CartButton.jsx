export function CartButton({ activeTab, totalPrice, hasProduct, productName, productConfirmed, onAction }) {
  const isProductTab = activeTab === 'product'
  const showProductCta = isProductTab && !productConfirmed
  const disabled = showProductCta && !hasProduct
  // Button text is uppercased via CSS `text-transform`, so we interpolate the
  // product name in its original case.
  const label = showProductCta
    ? `PERSONALIZE ${productName} - ${totalPrice}kr`
    : `ADD TO CART - ${totalPrice}kr`

  const bgClass = showProductCta
    ? 'bg-(--color-cta-product)'
    : 'bg-(--color-accent)'

  return (
    <div
      className="p-(--spacing-md) px-(--spacing-lg) bg-(--color-white) flex-shrink-0 relative"
      style={{ paddingBottom: 'max(var(--spacing-xl), env(safe-area-inset-bottom, var(--spacing-xl)))' }}
    >
      <button
        className={`w-full py-[16px] border-none rounded-(--radius-pill) font-[Helvetica_Neue,_-apple-system,_BlinkMacSystemFont,_sans-serif] text-sm uppercase tracking-[1px] text-(--color-white) cursor-pointer transition-[background-color,opacity] duration-(--duration-slow) ease-in-out [-webkit-tap-highlight-color:transparent] active:scale-[0.98] ${bgClass} ${disabled ? 'opacity-[0.45] cursor-default pointer-events-none' : ''}`}
        disabled={disabled}
        onClick={onAction}
      >
        {label}
      </button>
    </div>
  )
}
