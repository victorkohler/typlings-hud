import { useState, useCallback } from 'react'
import posterThumb from '../assets/poster-thumb-001.jpg'
import bodyThumb from '../assets/body-thumb-001.jpg'

const PRODUCTS = [
  {
    id: 'poster',
    name: 'Poster',
    thumbnail: posterThumb,
    supportsFrames: true,
    description: 'Printed on heavyweight matte paper for a gallery-quality finish',
    sizes: [
      { label: '30x40cm', price: 399 },
      { label: '50x70cm', price: 499 },
    ],
  },
  {
    id: 'baby-body',
    name: 'Baby Body',
    thumbnail: bodyThumb,
    supportsFrames: false,
    description: '100% organic cotton, pre-washed and soft on baby skin',
    sizes: [
      { label: 'XS', price: 299 },
      { label: 'S', price: 299 },
      { label: 'M', price: 299 },
      { label: 'L', price: 299 },
      { label: 'XL', price: 299 },
    ],
  },
]

const FRAMES = [
  { id: 'none', name: 'No Frame', price: 0 },
  { id: 'light-oak', name: 'Light Oak', price: 300 },
  { id: 'dark-oak', name: 'Dark Oak', price: 300 },
  { id: 'white', name: 'White', price: 300 },
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

const TABS = ['product', 'personalize', 'layout', 'design']

export function useConfigurator() {
  const [activeTab, setActiveTabRaw] = useState('product')

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

  // Completion badges. Every tab starts at `false` — a pre-selected default
  // (poster on Product, boxed on Layout, "no background" on Design) does NOT
  // count as a user-driven completion. The badge only appears once the user
  // has tapped the corresponding control themselves. Otherwise every new
  // session would start with two fake "already done" checkmarks.
  const [completions, setCompletions] = useState({
    product: false,
    personalize: false,
    layout: false,
    design: false,
  })

  const markComplete = useCallback((tab) => {
    setCompletions((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }))
  }, [])

  // Navigation wrapper. On every tab switch we mark the *previous* tab
  // complete if it isn't Personalize — the rule is "you've navigated away =
  // you've accepted the current state, including its defaults". Personalize
  // is the one exception because it has no meaningful default (an empty
  // textarea is not a completion), so it keeps its text-driven badge.
  // Product, Layout, and Design therefore never set their badge on selection
  // anymore; only on leave. This also covers the "user accepted the
  // pre-selected default without touching anything" path, which was the
  // strange case where a poster-pre-selected Product tab still read as
  // "incomplete" forever until the user tapped the product card.
  const setActiveTab = useCallback((nextTab) => {
    setActiveTabRaw((current) => {
      if (current !== nextTab && current !== 'personalize') {
        markComplete(current)
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
    // Personalize is the exception to the "mark-on-leave" rule — it tracks
    // current non-empty state so clearing the field removes the badge even
    // after the user has typed. There's no meaningful "accept the default"
    // for a blank textarea.
    const isComplete = value.trim().length > 0
    setCompletions((prev) => (
      prev.personalize === isComplete ? prev : { ...prev, personalize: isComplete }
    ))
  }, [])

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

  // Price calculation
  const product = PRODUCTS.find((p) => p.id === selectedProduct)
  const size = product?.sizes.find((s) => s.label === selectedSize)
  const frame = FRAMES.find((f) => f.id === selectedFrame)
  const basePrice = size?.price ?? 0
  const framePrice = frame?.price ?? 0
  const totalPrice = basePrice + framePrice

  // Advance from State 1 to State 2
  const advanceFromProduct = useCallback(() => {
    if (!selectedProduct) return
    setActiveTab('personalize')
  }, [selectedProduct, setActiveTab])

  return {
    // Data
    PRODUCTS,
    FRAMES,
    LAYOUTS,
    SOLID_COLORS,
    PATTERNS,
    TABS,

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
