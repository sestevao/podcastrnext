import format from 'date-fns/format'
import styles from './styles.module.scss'

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM')

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>The best to listen to, always</p>

      <span>{currentDate}</span>
    </header>
  )
}