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
    <div className="p-(--spacing-lg)">
      {/* Section title */}
      <h2 className="text-(--text-xs) tracking-[1px] font-light uppercase text-(--color-text-primary) mb-(--spacing-lg)">
        Typling products
      </h2>

      {/* Product grid */}
      <div
        className={columns === 2 ? 'grid grid-cols-2 gap-(--spacing-md)' : 'grid grid-cols-3 gap-(--spacing-md)'}
      >
        {products.map((p) => {
          const isSelected = selectedProduct === p.id
          return (
            <button
              key={p.id}
              className="block bg-none border-none p-0 text-left cursor-pointer [-webkit-tap-highlight-color:transparent]"
              onClick={() => onSelectProduct(p.id)}
            >
              <div
                className={[
                  'w-full aspect-[4/5] bg-(--color-surface-thumbnail) rounded-(--radius-md) border overflow-hidden transition-[border-color] duration-(--duration-normal) ease',
                  isSelected ? 'border-(--color-accent)' : 'border-transparent',
                ].join(' ')}
              >
                {p.thumbnail && (
                  <img
                    src={p.thumbnail}
                    alt=""
                    className="w-full h-full object-cover block pointer-events-none select-none opacity-0 transition-opacity duration-(--duration-slow) ease will-change-[opacity]"
                    decoding="async"
                    loading="eager"
                    draggable="false"
                    onLoad={(e) => {
                      const img = e.currentTarget
                      const reveal = () => {
                        img.style.opacity = isSelected ? '1' : '0.5'
                        img.dataset.loaded = 'true'
                      }
                      if (typeof img.decode === 'function') {
                        img.decode().then(reveal, reveal)
                      } else {
                        reveal()
                      }
                    }}
                  />
                )}
              </div>
              <div
                className={[
                  'pt-(--spacing-sm) text-(--text-md) font-normal transition-[color] duration-(--duration-normal) ease',
                  isSelected ? 'text-(--color-accent)' : 'text-(--color-text-primary)',
                ].join(' ')}
              >
                {p.name}
              </div>
            </button>
          )
        })}
      </div>

      {showOptions && (
        <hr className="border-none h-px bg-[#E5E5E5] my-(--spacing-lg)" />
      )}

      {showOptions && product && (
        <>
          {/* Size selector */}
          <div className="flex justify-between items-baseline mb-(--spacing-md)">
            <span className="text-(--text-xs) tracking-[1px] font-light uppercase text-(--color-text-primary)">
              Select size
            </span>
            <button className="text-(--text-xs) font-normal text-(--color-text-primary) underline bg-none border-none cursor-pointer">
              Size guide
            </button>
          </div>
          <div
            className={
              product.sizes.length > 3
                ? 'grid grid-cols-3 gap-(--spacing-sm)'
                : 'flex flex-row gap-(--spacing-sm)'
            }
          >
            {product.sizes.map((size) => {
              const isSizeSelected = selectedSize === size.label
              return (
                <button
                  key={size.label}
                  className={[
                    'flex-[1_1_0] min-w-0 flex justify-between items-center px-(--spacing-lg) py-(--spacing-md) rounded-(--radius-md) border cursor-pointer text-(--text-md) font-medium transition-[border-color,background,color] duration-(--duration-normal) ease [-webkit-tap-highlight-color:transparent]',
                    isSizeSelected
                      ? 'border-(--color-accent) bg-(--color-surface-card-selected) text-(--color-accent)'
                      : 'border-(--color-border-input) bg-(--color-white) text-(--color-text-secondary)',
                  ].join(' ')}
                  onClick={() => onSelectSize(size.label)}
                >
                  <span>{size.label}</span>
                  <span className="font-medium">{formatPrice(size.price)}</span>
                </button>
              )
            })}
          </div>

          {/* Product description (per-product, no price) */}
          <p className="mt-[10px] text-(--text-sm) italic text-(--color-text-secondary)">
            {product.description}
          </p>

          {frameOption && (
            <>
              <hr className="border-none h-px bg-[#E5E5E5] my-(--spacing-lg)" />

              {/* Frame selector */}
              <div className="flex justify-between items-baseline mb-(--spacing-md)">
                <span className="text-(--text-xs) tracking-[1px] font-light uppercase text-(--color-text-primary)">
                  Select Frame
                </span>
                <button className="text-(--text-xs) font-normal text-(--color-text-primary) underline bg-none border-none cursor-pointer">
                  Our frames
                </button>
              </div>
              <div className="flex gap-(--spacing-md)">
                {frameOption.choices.map((frame) => {
                  const delta = frame.price - currentFramePrice
                  const isFrameSelected = selectedFrame === frame.id
                  return (
                    <button
                      key={frame.id}
                      className="block bg-none border-none p-0 text-left cursor-pointer flex-[1_1_0] min-w-0 [-webkit-tap-highlight-color:transparent]"
                      onClick={() => onSelectFrame(frame.id)}
                    >
                      <div
                        className={[
                          'w-full aspect-square rounded-(--radius-sm) border transition-[background,border-color] duration-(--duration-normal) ease',
                          isFrameSelected
                            ? 'bg-(--color-surface-card-selected) border-(--color-accent)'
                            : 'bg-(--color-surface-thumbnail) border-transparent',
                        ].join(' ')}
                      />
                      <div
                        className={[
                          'text-(--text-sm) font-normal pt-[6px] transition-[color] duration-(--duration-normal) ease',
                          isFrameSelected ? 'text-(--color-accent)' : 'text-[#000000]',
                        ].join(' ')}
                      >
                        {frame.name}
                      </div>
                      <div className="text-(--text-sm) font-normal text-(--color-text-secondary) pt-[2px]">
                        {formatDelta(delta)}
                      </div>
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
