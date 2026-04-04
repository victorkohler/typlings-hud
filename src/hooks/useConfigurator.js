import { useState, useCallback } from 'react'

const PRODUCTS = [
  { id: 'poster', name: 'Poster', sizes: [{ label: '30x40cm', price: 399 }, { label: '50x70cm', price: 499 }] },
  { id: 'baby-body', name: 'Baby Body', sizes: [{ label: 'S', price: 299 }, { label: 'M', price: 299 }] },
]

const FRAMES = [
  { id: 'light-oak', name: 'Light Oak', price: 300 },
  { id: 'dark-oak', name: 'Dark Oak', price: 300 },
  { id: 'white', name: 'White', price: 300 },
  { id: 'none', name: 'No Frame', price: 0 },
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

  // State 1: Product selection
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedFrame, setSelectedFrame] = useState('none')

  // State 2: Text
  const [text, setText] = useState('')

  // State 3: Layout
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [orientation, setOrientation] = useState('horizontal')

  // State 4: Design
  const [selectedColor, setSelectedColor] = useState('charcoal')
  const [selectedPattern, setSelectedPattern] = useState(null)

  // Completion badges
  const [completions, setCompletions] = useState({
    product: false,
    personalize: false,
    layout: false,
    design: false,
  })

  const markComplete = useCallback((tab) => {
    setCompletions((prev) => ({ ...prev, [tab]: true }))
  }, [])

  // Product selection also pre-selects first size and "No Frame"
  const selectProduct = useCallback((productId) => {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) return
    setSelectedProduct(productId)
    setSelectedSize(product.sizes[0].label)
    setSelectedFrame('none')
    markComplete('product')
  }, [markComplete])

  const selectSize = useCallback((sizeLabel) => {
    setSelectedSize(sizeLabel)
  }, [])

  const selectFrame = useCallback((frameId) => {
    setSelectedFrame(frameId)
  }, [])

  const updateText = useCallback((value) => {
    setText(value)
    if (value.trim().length > 0) {
      markComplete('personalize')
    }
  }, [markComplete])

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
  }, [selectedProduct])

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
