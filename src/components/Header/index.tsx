import format from 'date-fns/format'
import styles from './styles.module.scss'

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM')

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>O melhor para ouvires, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}