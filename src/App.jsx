import styles from './App.module.css'
import { useConfigurator } from './hooks/useConfigurator'
import { PosterPreview } from './components/PosterPreview'
import { HudPanel } from './components/HudPanel'
import { TabBar } from './components/TabBar'
import { ProductSelector } from './components/ProductSelector'
import { TextPersonalizer } from './components/TextPersonalizer'
import { LayoutPicker } from './components/LayoutPicker'
import { DesignPicker } from './components/DesignPicker'
import { CartButton } from './components/CartButton'

export default function App() {
  const config = useConfigurator()
  const isExpanded = config.activeTab === 'product'

  const tabContent = {
    product: (
      <ProductSelector
        products={config.PRODUCTS}
        frames={config.FRAMES}
        selectedProduct={config.selectedProduct}
        selectedSize={config.selectedSize}
        selectedFrame={config.selectedFrame}
        onSelectProduct={config.selectProduct}
        onSelectSize={config.selectSize}
        onSelectFrame={config.selectFrame}
      />
    ),
    personalize: (
      <TextPersonalizer
        text={config.text}
        onTextChange={config.updateText}
      />
    ),
    layout: (
      <LayoutPicker
        layouts={config.LAYOUTS}
        selectedLayout={config.selectedLayout}
        orientation={config.orientation}
        onSelectLayout={config.selectLayout}
        onSetOrientation={config.setOrientation}
      />
    ),
    design: (
      <DesignPicker
        solidColors={config.SOLID_COLORS}
        patterns={config.PATTERNS}
        selectedColor={config.selectedColor}
        selectedPattern={config.selectedPattern}
        onSelectColor={config.selectColor}
        onSelectPattern={config.selectPattern}
      />
    ),
  }

  const handleCtaAction = () => {
    if (config.activeTab === 'product') {
      config.advanceFromProduct()
    }
  }

  return (
    <div className={styles.app}>
      <PosterPreview
        text={config.text}
        layout={config.selectedLayout}
        orientation={config.orientation}
        color={config.selectedColor}
        pattern={config.selectedPattern}
        isExpanded={isExpanded}
      />

      <HudPanel isExpanded={isExpanded}>
        <TabBar
          tabs={config.TABS}
          activeTab={config.activeTab}
          onTabChange={config.setActiveTab}
          completions={config.completions}
          productName={config.product?.name}
        />
        {tabContent[config.activeTab]}
      </HudPanel>

      <CartButton
        activeTab={config.activeTab}
        totalPrice={config.totalPrice}
        hasProduct={!!config.selectedProduct}
        onAction={handleCtaAction}
      />
    </div>
  )
}
