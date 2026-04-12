export function DesignPicker({
  solidColors,
  patterns,
  selectedColor,
  selectedPattern,
  onSelectColor,
  onSelectPattern,
}) {
  return (
    <div className="p-(--spacing-lg)">
      {/* Background color section — solids tint the poster's content-zone
          background (same surface the patterns tint). The first entry is the
          `none` sentinel, rendered as a white circle with a gray diagonal
          line. It's the pre-selected default so the poster starts with no
          background fill. */}
      <div className="flex justify-between items-baseline mb-(--spacing-md)">
        <span className="text-xs tracking-[1px] font-light uppercase text-(--color-text-primary)">Background color</span>
      </div>
      <div className="flex flex-wrap justify-start items-center gap-x-(--spacing-md) gap-y-(--spacing-md) py-(--spacing-xs)">
        {solidColors.map((color) => {
          const isNone = color.id === 'none'
          const isSelected = selectedColor === color.id
          return (
            <button
              key={color.id}
              type="button"
              aria-label={color.name}
              aria-pressed={isSelected}
              className={[
                'w-8 h-8 rounded-full p-0 cursor-pointer box-border',
                'transition-[border-color,background,transform] duration-(--duration-normal) ease',
                '[-webkit-tap-highlight-color:transparent]',
                isSelected
                  ? 'border-[2.5px] border-(--color-accent) scale-[1.15]'
                  : 'border-[1.5px] border-(--color-border-swatch)',
              ].join(' ')}
              style={
                isNone
                  ? {
                      background:
                        'linear-gradient(135deg, var(--color-white) 0 calc(50% - 1px), var(--color-border-swatch) calc(50% - 1px) calc(50% + 1px), var(--color-white) calc(50% + 1px) 100%)',
                    }
                  : { background: color.hex }
              }
              onClick={() => onSelectColor(color.id)}
            />
          )
        })}
      </div>

      <hr className="border-none h-px bg-[#E5E5E5] my-(--spacing-lg)" />

      {/* Background pattern section */}
      <div className="flex justify-between items-baseline mb-(--spacing-md)">
        <span className="text-xs tracking-[1px] font-light uppercase text-(--color-text-primary)">Background pattern</span>
      </div>
      <div className="flex flex-wrap justify-start items-center gap-x-(--spacing-md) gap-y-(--spacing-md) py-(--spacing-xs)">
        {patterns.map((pattern) => {
          const isSelected = selectedPattern === pattern.id
          return (
            <button
              key={pattern.id}
              type="button"
              aria-label={pattern.name}
              aria-pressed={isSelected}
              className={[
                'w-8 h-8 rounded-full p-0 cursor-pointer box-border',
                'transition-[border-color,background,transform] duration-(--duration-normal) ease',
                '[-webkit-tap-highlight-color:transparent]',
                isSelected
                  ? 'border-[2.5px] border-(--color-accent) scale-[1.15]'
                  : 'border-[1.5px] border-(--color-border-swatch)',
              ].join(' ')}
              // Inline diagonal stripes mirror the pattern rendering in
              // PosterPreview's content zone so a swatch reads as a scaled-down
              // preview of what the poster background will look like.
              style={{
                background: `repeating-linear-gradient(45deg, ${pattern.hex} 0 3px, rgba(0, 0, 0, 0.08) 3px 6px)`,
              }}
              onClick={() => onSelectPattern(pattern.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
