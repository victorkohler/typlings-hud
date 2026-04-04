import styles from './TabBar.module.css'

export function TabBar({ tabs, activeTab, onTabChange, completions, productName }) {
  return (
    <div className={styles.tabBar}>
      <p className={styles.placeholder}>Tab Bar</p>
    </div>
  )
}
