import { useState, useCallback } from 'react'
import posterThumb from '../assets/poster-thumb-001.jpg'
import bodyThumb from '../assets/body-thumb-001.jpg'

const PRODUCTS = [
  {
    id: 'poster',
    name: 'Poster',
    thumbnail: posterThumb,
    supportsFrames: true,
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

const SOLID_COLORS = [
  { id: 'coral', hex: '#E8745A', name: 'Coral' },
  { id: 'charcoal', hex: '#2D2D2D', name: 'Charcoal' },
  { id: 'forest', hex: '#4A6741', name: 'Forest' },
  { id: 'slate-blue', hex: '#3B5998', name: 'Slate Blue' },
  { id: 'saddle-brown', hex: '#8B4513', name: 'Saddle Brown' },
  { id: 'goldenrod', hex: '#DAA520', name: 'Goldenrod' },
]

const PATTERNS = [
  { id: 'cream', hex: '#F5E6D3', name: 'Cream' },
  { id: 'wheat', hex: '#E8D5B7', name: 'Wheat' },
  { id: 'sand', hex: '#D4C5A9', name: 'Sand' },
  { id: 'khaki', hex: '#C0B59B', name: 'Khaki' },
  { id: 'sage', hex: '#ACA58D', name: 'Sage' },
]

const TABS = ['product', 'personalize', 'layout', 'design']

export function useConfigurator() {
  const [activeTab, setActiveTab] = useState('product')

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

  // State 3: Layout
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [orientation, setOrientation] = useState('horizontal')

  // State 4: Design
  const [selectedColor, setSelectedColor] = useState('charcoal')
  const [selectedPattern, setSelectedPattern] = useState(null)

  // Completion badges (product starts true since we pre-select one)
  const [completions, setCompletions] = useState({
    product: true,
    personalize: false,
    layout: false,
    design: false,
  })

  const markComplete = useCallback((tab) => {
    setCompletions((prev) => ({ ...prev, [tab]: true }))
  }, [])

  const selectProduct = useCallback((productId) => {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) return
    setSelectedProduct(productId)
    markComplete('product')
  }, [markComplete])

  const selectSize = useCallback((sizeLabel) => {
    setSizeByProduct((prev) => ({ ...prev, [selectedProduct]: sizeLabel }))
  }, [selectedProduct])

  const selectFrame = useCallback((frameId) => {
    setSelectedFrame(frameId)
  }, [])

  const updateText = useCallback((value) => {
    setText(value)
    // Completion tracks current non-empty state — clearing the field removes
    // the Personalize step's completion badge.
    const isComplete = value.trim().length > 0
    setCompletions((prev) => (
      prev.personalize === isComplete ? prev : { ...prev, personalize: isComplete }
    ))
  }, [])

  const selectLayout = useCallback((layoutId) => {
    setSelectedLayout(layoutId)
    markComplete('layout')
  }, [markComplete])

  const selectColor = useCallback((colorId) => {
    setSelectedColor(colorId)
    setSelectedPattern(null)
    markComplete('design')
  }, [markComplete])

  const selectPattern = useCallback((patternId) => {
    setSelectedPattern(patternId)
    setSelectedColor(null)
    markComplete('design')
  }, [markComplete])

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
    product,
  }
}
