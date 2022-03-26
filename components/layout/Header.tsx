import styles from 'styles/layout/Header.module.scss'
import { FiBarChart2, FiInfo, FiSettings } from 'react-icons/fi'
import Link from 'next/link'
import Icon17S from 'assets/17s.icon.svg'
import classNames from 'classnames'
import DateChanger from 'components/layout/DateChanger'
import { useRouter } from 'next/router'

interface HeaderProps {
  hideNavigation?: boolean
}

export default function Header ({ hideNavigation }: HeaderProps) {
  const nav = (
    <nav className={styles.nav}>
      <Link href="#info" scroll={false}>
        <a className={styles.navEntry} title="Info">
          <FiInfo />
        </a>
      </Link>
      <Link href="#statistics" scroll={false}>
        <a className={styles.navEntry} title="Statistics">
          <FiBarChart2 />
        </a>
      </Link>
      <DateChanger className={styles.navEntry} />
      <Link href="#settings" scroll={false}>
        <a className={styles.navEntry} title="Settings">
          <FiSettings />
        </a>
      </Link>
    </nav>
  )

  const router = useRouter()

  function refreshIfNecessary () {
    if (router.query.date === undefined) {
      window.location.reload()
    }
  }

  return (
    <header className={classNames(styles.header, { [styles.navigationHidden]: hideNavigation })}>
      <Link href="/">
        <a onClick={refreshIfNecessary}>
          <h1><Icon17S /> Shardle</h1>
        </a>
      </Link>
      {hideNavigation !== true && nav}
    </header>
  )
}
