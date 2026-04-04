import styles from './HudPanel.module.css'

export function HudPanel({ isExpanded, children }) {
  return (
    <div className={`${styles.panel} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      {children}
    </div>
  )
}
