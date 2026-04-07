import { useState, useCallback } from 'react'
import posterThumb from '../assets/poster-thumb-001.jpg'
import bodyThumb from '../assets/body-thumb-001.jpg'

const FRAMES = [
  { id: 'none', name: 'No Frame', price: 0 },
  { id: 'light-oak', name: 'Light Oak', price: 300 },
  { id: 'dark-oak', name: 'Dark Oak', price: 300 },
  { id: 'white', name: 'White', price: 300 },
]

// Each product declares its own options. Components read `product.options`
// to decide what to render — no feature flags like `supportsFrames`. Adding
// a new option type (e.g. material, color) means adding it here and teaching
// one component to render it, without touching unrelated products.
const PRODUCTS = [
  {
    id: 'poster',
    name: 'Poster',
    thumbnail: posterThumb,
    description: 'Printed on heavyweight matte paper for a gallery-quality finish',
    sizes: [
      { label: '30x40cm', price: 399 },
      { label: '50x70cm', price: 499 },
    ],
    options: [
      { type: 'frame', choices: FRAMES },
    ],
  },
  {
    id: 'baby-body',
    name: 'Baby Body',
    thumbnail: bodyThumb,
    description: '100% organic cotton, pre-washed and soft on baby skin',
    sizes: [
      { label: 'XS', price: 299 },
      { label: 'S', price: 299 },
      { label: 'M', price: 299 },
      { label: 'L', price: 299 },
      { label: 'XL', price: 299 },
    ],
    options: [],
  },
]

const LAYOUTS = [
  { id: 'boxed', name: 'Boxed' },
  { id: 'wave', name: 'Wave' },
  { id: 'pattern', name: 'Pattern' },
  { id: 'circular', name: 'Circular' },
  { id: 'hero', name: 'Hero' },
]

// Solid colors drive the poster's *content-zone background* fill (same surface
// the pattern swatches tint — they're two alternative ways to set the same
// background). The first entry, `none`, is the pre-selected default: no fill,
// rendered as a white swatch with a diagonal gray line. The remaining eight
// are saturated hues spanning the color wheel so the row reads as "pick any
// mood" rather than a single tonal family. `hex: null` on `none` is the
// sentinel PosterPreview checks to skip the fill lookup.
const SOLID_COLORS = [
  { id: 'none', hex: null, name: 'No background' },
  { id: 'charcoal', hex: '#2D2D2D', name: 'Charcoal' },
  { id: 'coral', hex: '#E8745A', name: 'Coral' },
  { id: 'forest', hex: '#4A6741', name: 'Forest' },
  { id: 'slate-blue', hex: '#3B5998', name: 'Slate Blue' },
  { id: 'saddle-brown', hex: '#8B4513', name: 'Saddle Brown' },
  { id: 'goldenrod', hex: '#DAA520', name: 'Goldenrod' },
  { id: 'burgundy', hex: '#7B1F2B', name: 'Burgundy' },
  { id: 'teal', hex: '#2F6F6B', name: 'Teal' },
]

// Patterns tint the poster's content-zone background. Six soft pastels in
// distinct hue families (warm neutral, pink, green, blue, yellow, purple) so
// the row offers visible variety instead of the previous all-beige set.
const PATTERNS = [
  { id: 'cream', hex: '#F5E6D3', name: 'Cream' },
  { id: 'blush', hex: '#F8D7D1', name: 'Blush' },
  { id: 'sage', hex: '#CFDBC5', name: 'Sage' },
  { id: 'sky', hex: '#D6E4F0', name: 'Sky' },
  { id: 'butter', hex: '#F5E6A8', name: 'Butter' },
  { id: 'lilac', hex: '#E4D7EE', name: 'Lilac' },
]

const DEFAULT_TABS = ['product', 'personalize', 'layout', 'design']

// Completion rules determine when a tab's badge appears:
//   on_leave  — marked complete when the user navigates away
//   on_enter  — marked complete as soon as the user enters the tab
//   on_content — driven by content (e.g. non-empty text); set/unset externally
// Variants can override per tab via the `completionRules` option.
const DEFAULT_COMPLETION_RULES = {
  product: 'on_leave',
  personalize: 'on_content',
  layout: 'on_enter',
  design: 'on_enter',
  details: 'on_enter',
}

export function useConfigurator({ tabs = DEFAULT_TABS, completionRules = {} } = {}) {
  const [activeTab, setActiveTabRaw] = useState(tabs[0])

  // State 1: Product selection (poster pre-selected by default).
  // Size is remembered per product: switching poster → baby-body → poster
  // restores the last size chosen for each. Frame selection persists across
  // product switches too (hidden but retained for products without frames).
  const [selectedProduct, setSelectedProduct] = useState('poster')
  const [sizeByProduct, setSizeByProduct] = useState(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.sizes[0].label]))
  )
  const [selectedFrame, setSelectedFrame] = useState('none')
  const selectedSize = sizeByProduct[selectedProduct]

  // State 2: Text
  const [text, setText] = useState('')

  // State 3: Layout (boxed pre-selected by default, same pattern as product)
  const [selectedLayout, setSelectedLayout] = useState('boxed')
  const [orientation, setOrientation] = useState('horizontal')

  // State 4: Design — `none` is the pre-selected background (no fill). Solids
  // and patterns are mutually exclusive; both write to the content-zone bg.
  const [selectedColor, setSelectedColor] = useState('none')
  const [selectedPattern, setSelectedPattern] = useState(null)

  // Merge default rules with any variant overrides. Every tab gets a rule.
  const rules = { ...DEFAULT_COMPLETION_RULES, ...completionRules }
  const getRule = (tab) => rules[tab] || 'on_leave'

  // Completion badges. Every tab starts at `false`.
  const [completions, setCompletions] = useState(() =>
    Object.fromEntries(tabs.map((t) => [t, false]))
  )

  const markComplete = useCallback((tab) => {
    setCompletions((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }))
  }, [])

  // on_content tabs can be toggled on/off based on external state.
  const setCompletion = useCallback((tab, value) => {
    setCompletions((prev) => (prev[tab] === value ? prev : { ...prev, [tab]: value }))
  }, [])

  // Navigation wrapper. Applies on_leave (outgoing tab) and on_enter
  // (incoming tab) rules automatically on every tab switch.
  const setActiveTab = useCallback((nextTab) => {
    setActiveTabRaw((current) => {
      if (current !== nextTab) {
        if (getRule(current) === 'on_leave') markComplete(current)
        if (getRule(nextTab) === 'on_enter') markComplete(nextTab)
      }
      return nextTab
    })
  }, [markComplete])

  const selectProduct = useCallback((productId) => {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) return
    setSelectedProduct(productId)
  }, [])

  const selectSize = useCallback((sizeLabel) => {
    setSizeByProduct((prev) => ({ ...prev, [selectedProduct]: sizeLabel }))
  }, [selectedProduct])

  const selectFrame = useCallback((frameId) => {
    setSelectedFrame(frameId)
  }, [])

  const updateText = useCallback((value) => {
    setText(value)
    // on_content: badge tracks whether the textarea has non-empty text.
    setCompletion('personalize', value.trim().length > 0)
  }, [setCompletion])

  const selectLayout = useCallback((layoutId) => {
    setSelectedLayout(layoutId)
  }, [])

  const selectColor = useCallback((colorId) => {
    setSelectedColor(colorId)
    setSelectedPattern(null)
  }, [])

  const selectPattern = useCallback((patternId) => {
    setSelectedPattern(patternId)
    setSelectedColor(null)
  }, [])

  // Price calculation — only include options the selected product declares.
  const product = PRODUCTS.find((p) => p.id === selectedProduct)
  const size = product?.sizes.find((s) => s.label === selectedSize)
  const frameOption = product?.options.find((o) => o.type === 'frame')
  const frame = frameOption ? frameOption.choices.find((f) => f.id === selectedFrame) : null
  const basePrice = size?.price ?? 0
  const framePrice = frame?.price ?? 0
  const totalPrice = basePrice + framePrice

  // Advance from the Product tab to the next tab in sequence.
  const advanceFromProduct = useCallback(() => {
    if (!selectedProduct) return
    const nextIndex = tabs.indexOf('product') + 1
    if (nextIndex < tabs.length) setActiveTab(tabs[nextIndex])
  }, [selectedProduct, setActiveTab, tabs])

  return {
    // Data
    PRODUCTS,
    LAYOUTS,
    SOLID_COLORS,
    PATTERNS,
    TABS: tabs,

    // Navigation
    activeTab,
    setActiveTab,

    // Selections
    selectedProduct,
    selectedSize,
    selectedFrame,
    text,
    selectedLayout,
    orientation,
    selectedColor,
    selectedPattern,

    // Actions
    selectProduct,
    selectSize,
    selectFrame,
    updateText,
    selectLayout,
    setOrientation,
    selectColor,
    selectPattern,
    advanceFromProduct,

    // Derived
    completions,
    totalPrice,
    basePrice,
    framePrice,
    product,
    frame,
    size,
  }
}
