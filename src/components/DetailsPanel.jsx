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
    <div className={flush ? 'py-(--spacing-lg)' : 'p-(--spacing-lg)'}>
      {/* Size selector */}
      <div className="flex justify-between items-baseline mb-(--spacing-md)">
        <span className="text-xs tracking-[1px] font-light uppercase text-(--color-text-primary)">Select size</span>
        <button className="text-xs font-normal text-(--color-text-primary) underline bg-none border-none cursor-pointer">Size guide</button>
      </div>
      <div className={`${product.sizes.length > 3 ? 'grid grid-cols-3' : 'flex flex-row'} gap-(--spacing-sm)`}>
        {product.sizes.map((size) => {
          const isSelected = selectedSize === size.label
          return (
            <button
              key={size.label}
              className={[
                'flex-[1_1_0] min-w-0 flex justify-between items-center',
                'px-(--spacing-lg) py-(--spacing-md)',
                'rounded-(--radius-md) border cursor-pointer',
                'text-md font-medium',
                'transition-all duration-(--duration-normal) ease',
                '[-webkit-tap-highlight-color:transparent]',
                isSelected
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

      <p className="mt-[10px] text-sm italic text-(--color-text-secondary)">
        {product.description}
      </p>

      {frameOption && (
        <>
          <hr className="border-none h-px bg-[#E5E5E5] my-(--spacing-lg)" />

          <div className="flex justify-between items-baseline mb-(--spacing-md)">
            <span className="text-xs tracking-[1px] font-light uppercase text-(--color-text-primary)">Select Frame</span>
            <button className="text-xs font-normal text-(--color-text-primary) underline bg-none border-none cursor-pointer">Our frames</button>
          </div>
          <div className="flex gap-(--spacing-md)">
            {frameOption.choices.map((frame) => {
              const delta = frame.price - currentFramePrice
              const isSelected = selectedFrame === frame.id
              return (
                <button
                  key={frame.id}
                  className="block bg-none border-none p-0 text-left cursor-pointer flex-[1_1_0] min-w-0 [-webkit-tap-highlight-color:transparent]"
                  onClick={() => onSelectFrame(frame.id)}
                >
                  <div
                    className={[
                      'w-full aspect-square rounded-(--radius-sm) border',
                      'transition-all duration-(--duration-normal) ease',
                      isSelected
                        ? 'bg-(--color-surface-card-selected) border-(--color-accent)'
                        : 'bg-(--color-surface-thumbnail) border-transparent',
                    ].join(' ')}
                  />
                  <div
                    className={[
                      'text-sm font-normal pt-[6px]',
                      'transition-[color] duration-(--duration-normal) ease',
                      isSelected ? 'text-(--color-accent)' : 'text-[#000000]',
                    ].join(' ')}
                  >
                    {frame.name}
                  </div>
                  <div className="text-sm font-normal text-(--color-text-secondary) pt-[2px]">
                    {formatDelta(delta)}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
