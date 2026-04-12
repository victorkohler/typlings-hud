import React, { useRef, useCallback } from 'react'

function IconProduct() {
  return (
    <svg width="22" height="22" viewBox="0 0 34.348 34.347" fill="currentColor">
      <path d="M0,0v34.347h34.348V0H0ZM32.118,32.117H2.23V2.23h29.888v29.887Z"/>
      <path d="M17.174,17.375c6.131,0,11.121-4.99,11.121-11.122h-2.23c0,4.903-3.988,8.892-8.891,8.892s-8.893-3.989-8.893-8.892h-2.23c0,6.132,4.99,11.122,11.123,11.122Z"/>
    </svg>
  )
}

function IconPoster() {
  return (
    <svg width="22" height="22" viewBox="0 0 34.647 33.946" fill="currentColor">
      <path d="M28.334,29.007V0H0v29.898c0,2.232,1.816,4.048,4.047,4.048h26.552c2.232,0,4.048-1.816,4.048-4.048v-.891h-6.313ZM1.783,29.898V1.783h24.768v27.224H6.312v.891c0,1.248-1.016,2.265-2.265,2.265s-2.264-1.017-2.264-2.265ZM30.599,32.163H7.389c.28-.412.494-.872.607-1.374h24.686c-.346.808-1.149,1.374-2.082,1.374Z"/>
    </svg>
  )
}

function IconBabyBody() {
  return (
    <svg width="22" height="22" viewBox="0 0 39.831 33.697" fill="currentColor">
      <path d="M39.215,10.247l-6.71-6.634v-.002l-.261-.261c-.794-.793-1.43-1.404-2.068-2.018l-.888-.858c-.441-.428-1.05-.574-1.634-.397-.586.18-1.027.67-1.152,1.277-.638,3.109-3.408,5.365-6.588,5.365s-5.949-2.257-6.59-5.369c-.123-.606-.565-1.094-1.147-1.274-.582-.184-1.194-.032-1.635.394l-.82.789c-.667.639-1.324,1.269-2.141,2.094l-.236.239L.615,10.247C.221,10.637.002,11.157,0,11.713c-.002.556.214,1.078.606,1.472l4.341,4.339c.391.392.911.607,1.465.607.326,0,.629-.095.912-.237v7.052l6.843,8.751h11.494l6.843-8.751v-7.051c.283.141.587.236.912.236.554,0,1.074-.215,1.465-.606l4.341-4.341c.393-.393.608-.915.606-1.471-.002-.555-.221-1.076-.615-1.466ZM6.619,16.266c-.099.1-.318.096-.414,0L1.865,11.927c-.075-.075-.085-.162-.085-.209,0-.045.012-.133.087-.207l5.458-5.397v9.445l-.706.706ZM30.726,24.333l-5.933,7.585h-9.756l-5.933-7.585V4.346c.686-.688,1.265-1.241,1.849-1.801l.671-.645c.881,3.835,4.338,6.599,8.291,6.599,3.992,0,7.474-2.814,8.248-6.638l.782.754c.558.537,1.116,1.072,1.781,1.733v19.984ZM37.966,11.926l-4.341,4.341c-.096.097-.315.098-.414,0l-.706-.707V6.115l5.458,5.397c.075.074.087.162.087.207,0,.046-.01.134-.085.208Z"/>
    </svg>
  )
}

function IconPersonalize() {
  return (
    <svg width="22" height="22" viewBox="0 0 29.178 33.946" fill="currentColor">
      <path d="M0,0h29.178v8.944h-3.485l-.865-5.41-.74-.644h-6.078v27.522l.865.791,3.286.272v2.471H7.017v-2.471l3.311-.272.84-.791V2.89h-6.054l-.766.644-.865,5.41H0V0Z"/>
    </svg>
  )
}

function IconLayout() {
  return (
    <svg width="22" height="22" viewBox="0 0 33.881 33.984" fill="currentColor">
      <path d="M2.395,15.447h10.658c1.321,0,2.395-1.074,2.395-2.394V2.394c0-1.32-1.074-2.394-2.395-2.394H2.395C1.074,0,0,1.074,0,2.394v10.659c0,1.32,1.074,2.394,2.395,2.394ZM1.783,2.394c0-.337.274-.611.612-.611h10.658c.338,0,.612.274.612.611v10.659c0,.338-.274.611-.612.611H2.395c-.338,0-.612-.273-.612-.611V2.394Z"/>
      <path d="M31.487,0h-10.657c-1.321,0-2.396,1.074-2.396,2.394v10.659c0,1.32,1.074,2.394,2.396,2.394h10.657c1.32,0,2.394-1.074,2.394-2.394V2.394c0-1.32-1.074-2.394-2.394-2.394ZM32.098,13.053c0,.338-.273.611-.611.611h-10.657c-.338,0-.613-.273-.613-.611V2.394c0-.337.275-.611.613-.611h10.657c.338,0,.611.274.611.611v10.659Z"/>
      <path d="M31.487,18.537H2.395c-1.321,0-2.395,1.074-2.395,2.394v10.659c0,1.32,1.074,2.394,2.395,2.394h29.092c1.32,0,2.394-1.074,2.394-2.394v-10.659c0-1.32-1.074-2.394-2.394-2.394ZM32.098,31.59c0,.338-.273.611-.611.611H2.395c-.338,0-.612-.273-.612-.611v-10.659c0-.338.274-.611.612-.611h29.092c.338,0,.611.273.611.611v10.659Z"/>
    </svg>
  )
}

function IconDesign() {
  return (
    <svg width="22" height="22" viewBox="0 0 37.448 34.438" fill="currentColor">
      <path d="M29.867,12.025c.006-.153.023-.303.023-.457,0-6.379-5.189-11.568-11.568-11.568S6.754,5.189,6.754,11.568c0,.262.022.519.039.777C2.793,14.168,0,18.195,0,22.87c0,6.379,5.189,11.568,11.568,11.568,2.702,0,5.185-.938,7.156-2.496,1.971,1.558,4.454,2.496,7.156,2.496,6.378,0,11.568-5.188,11.568-11.568,0-4.976-3.164-9.216-7.581-10.845ZM21.353,22.87c0,2.57-1.004,4.904-2.629,6.652-1.616-1.737-2.615-4.054-2.627-6.605.721.141,1.464.22,2.225.22,1.048,0,2.058-.152,3.024-.415,0,.05.008.098.008.148ZM18.322,21.354c-.708,0-1.398-.08-2.064-.223.339-1.879,1.216-3.569,2.465-4.912,1.206,1.296,2.072,2.913,2.435,4.713-.899.273-1.85.423-2.837.423ZM14.539,20.592c-2.946-1.24-5.161-3.881-5.808-7.085.898-.273,1.85-.422,2.836-.422,2.186,0,4.2.729,5.83,1.945-1.417,1.532-2.433,3.439-2.859,5.562ZM20.05,15.03c1.631-1.216,3.645-1.945,5.83-1.945.708,0,1.398.08,2.064.223-.546,3.022-2.479,5.564-5.119,6.939-.463-1.984-1.436-3.769-2.775-5.217ZM8.537,11.568c0-5.396,4.389-9.786,9.785-9.786s9.758,4.365,9.783,9.739c-.721-.141-1.464-.22-2.225-.22-2.702,0-5.185.938-7.156,2.496-1.971-1.558-4.454-2.496-7.156-2.496-1.047,0-2.057.152-3.023.414,0-.05-.008-.098-.008-.148ZM1.783,22.87c0-3.772,2.149-7.046,5.283-8.679.887,3.807,3.654,6.889,7.269,8.222-.006.153-.023.303-.023.457,0,3.027,1.177,5.776,3.086,7.84-1.631,1.216-3.645,1.945-5.83,1.945-5.396,0-9.785-4.389-9.785-9.785ZM25.88,32.655c-2.186,0-4.2-.729-5.83-1.945,1.909-2.063,3.086-4.813,3.086-7.84,0-.262-.022-.519-.039-.777,3.333-1.518,5.828-4.565,6.566-8.247,3.523,1.482,6.003,4.969,6.003,9.024,0,5.396-4.389,9.785-9.786,9.785Z"/>
    </svg>
  )
}

function IconDetails() {
  return (
    <svg width="22" height="22" viewBox="0 0 34.172 34.171" fill="currentColor">
      <path d="M27.008,0H7.166C3.215,0,0,3.214,0,7.164v19.842c0,3.95,3.215,7.165,7.166,7.165h19.842c3.949,0,7.164-3.215,7.164-7.165V7.164c0-3.95-3.215-7.164-7.164-7.164ZM32.413,27.006c0,2.981-2.425,5.406-5.406,5.406H7.166c-2.981,0-5.407-2.425-5.407-5.406V7.164C1.758,4.183,4.185,1.758,7.166,1.758h19.842c2.981,0,5.406,2.425,5.406,5.406v19.842Z"/>
      <path d="M9.498,14.417c-1.474,0-2.669,1.195-2.669,2.669s1.195,2.669,2.669,2.669,2.669-1.195,2.669-2.669-1.195-2.669-2.669-2.669Z"/>
      <circle cx="17.086" cy="17.085" r="2.669"/>
      <path d="M24.673,14.417c-1.474,0-2.669,1.195-2.669,2.669s1.195,2.669,2.669,2.669,2.669-1.195,2.669-2.669-1.195-2.669-2.669-2.669Z"/>
    </svg>
  )
}

function CompletionBadge() {
  return (
    <span className="absolute -top-0.5 -right-1.5 w-3 h-3 bg-(--color-accent) rounded-full flex items-center justify-center [box-shadow:0_0_0_1.5px_var(--color-white)]">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1.5 4l2 2L6.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

const TAB_CONFIG = {
  product: { icon: IconProduct, label: 'Product' },
  personalize: { icon: IconPersonalize, label: 'Personalize' },
  layout: { icon: IconLayout, label: 'Layout' },
  design: { icon: IconDesign, label: 'Design' },
  details: { icon: IconDetails, label: 'Details' },
}

// Product-specific icon that replaces the generic Product tab icon once the
// user has confirmed a product by navigating away from the Product tab.
const PRODUCT_ICON = {
  poster: IconPoster,
  'baby-body': IconBabyBody,
}

export function TabBar({ tabs, activeTab, onTabChange, onTabPointerDown, completions, selectedProductId, selectedProductName }) {
  const activeIndex = tabs.indexOf(activeTab)
  const tabRefs = useRef({})

  // Arrow-key navigation per WAI-ARIA Tabs pattern: Left/Right cycle through
  // tabs, Home/End jump to first/last. Focus follows selection so the active
  // tab is always the one in the tab order (tabIndex 0).
  const handleKeyDown = useCallback((e) => {
    let nextIndex = null
    if (e.key === 'ArrowRight') {
      nextIndex = (activeIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1
    }
    if (nextIndex !== null) {
      e.preventDefault()
      const nextTab = tabs[nextIndex]
      onTabChange(nextTab)
      tabRefs.current[nextTab]?.focus()
    }
  }, [activeIndex, tabs, onTabChange])

  return (
    <div
      role="tablist"
      aria-label="Configurator steps"
      className="relative flex gap-[10px] px-2 py-[10px] bg-[#f2f2f2] rounded-(--radius-lg) rounded-b-none"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute top-1.5 bottom-1.5 bg-[#fcfcfc] rounded-[14px] pointer-events-none"
        style={{
          left: `calc(8px + ${activeIndex} * (100% - 6px) / ${tabs.length})`,
          width: `calc((100% - 56px) / ${tabs.length})`,
          transition: 'left 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      {tabs.map((tabId) => {
        const config = TAB_CONFIG[tabId]
        const isActive = activeTab === tabId
        const isComplete = completions[tabId]

        // The Product tab's icon + label reflect whatever product is currently
        // selected (updates live, not on navigate-away). Falls back to the
        // generic Product icon if the selected id has no entry in PRODUCT_ICON.
        const isProductTab = tabId === 'product'
        const productIcon = isProductTab ? PRODUCT_ICON[selectedProductId] : null
        const Icon = productIcon ?? config.icon
        const label = isProductTab && selectedProductName ? selectedProductName : config.label

        return (
          <button
            key={tabId}
            ref={(el) => { tabRefs.current[tabId] = el }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={[
              'relative z-10 flex flex-col items-center gap-1 flex-[1_1_0] py-1.5 px-0 bg-transparent border-none cursor-pointer [-webkit-tap-highlight-color:transparent]',
              isActive ? 'text-(--color-accent)' : 'text-(--color-text-secondary)',
            ].join(' ')}
            onPointerDown={onTabPointerDown}
            onClick={() => onTabChange(tabId)}
          >
            <span className="relative flex items-center justify-center w-[22px] h-[22px]">
              <Icon />
              {isComplete && <CompletionBadge />}
            </span>
            <span
              className={[
                'text-xs font-normal tracking-[0.3px] [font-family:\'Helvetica_Neue\',-apple-system,BlinkMacSystemFont,sans-serif]',
                isActive ? 'text-(--color-accent)' : 'text-(--color-text-primary)',
              ].join(' ')}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
