import 'styles/globals.scss'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import styles from 'styles/layout.module.scss'
import Head from 'next/head'
import Header from 'components/layout/Header'
import { useEffect, useState } from 'react'
import { NotificationContainer } from 'components/layout/notifications'
import { Context as SettingsContext, Settings } from 'lib/settings'
import { useRouter } from 'next/router'
import { DateContext, getCurrentDate, getDay, parseDate } from 'lib/dates'

type CustomNextPage = NextPage & {
  hideNavigation?: boolean
}

type CustomAppProps = AppProps & {
  Component: CustomNextPage
}

function MyApp ({ Component, pageProps: { ...pageProps } }: CustomAppProps) {
  const router = useRouter()

  // @ts-ignore
  const defaultDate: ShardleDate = getCurrentDate()
  defaultDate.shardleDay = getDay(defaultDate)
  defaultDate.isToday = true
  const [date, setDate] = useState(defaultDate)

  useEffect(
    () => {
      const rawDate = router.query.date

      // @ts-ignore
      const date: ShardleDate | null = rawDate === undefined ? getCurrentDate() : parseDate(rawDate)
      if (date === null) {
        return
      }

      date.shardleDay = getDay(date)
      date.isToday = date.getTime() === getCurrentDate().getTime()
      setDate(date)
    },
    [router.isReady, router.query, router.query.date]
  )

  const [activeSettings, setActiveSettings] = useState<Partial<Settings>>({})
  const [browserDarkMode, setBrowserDarkMode] = useState(false)

  useEffect(
    () => {
      const stored = window.localStorage.getItem('settings')
      if (stored !== null) {
        setActiveSettings(JSON.parse(stored))
      }

      setBrowserDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    },
    []
  )

  const settings = {
    hardMode: false,
    allowCommonEnglish: true,
    darkMode: browserDarkMode,
    ...activeSettings
  }

  useEffect(
    () => {
      const className = settings.darkMode ? 'dark-theme' : 'light-theme'

      document.body.classList.add(className)

      return () => {
        document.body.classList.remove(className)
      }
    },
    [settings.darkMode, browserDarkMode]
  )

  function updateSetting<S extends keyof Settings> (setting: S, value: Settings[S]) {
    const updated = { ...activeSettings, [setting]: value }
    setActiveSettings(updated)
    window.localStorage.setItem('settings', JSON.stringify(updated))
  }

  return (
    <div id="app" className="app">
      <SettingsContext.Provider value={[settings, updateSetting]}>
        <DateContext.Provider value={date}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <NotificationContainer>
            <Header hideNavigation={Component.hideNavigation} />
            <main className={styles.main}>
              <Component {...pageProps} />
            </main>
          </NotificationContainer>
        </DateContext.Provider>
      </SettingsContext.Provider>
    </div>
  )
}

export default MyApp
