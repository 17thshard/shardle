import 'styles/globals.scss'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import styles from 'styles/layout.module.scss'
import Head from 'next/head'
import Header from 'components/layout/Header'
import { createContext, useEffect, useState } from 'react'
import { NotificationContainer } from 'components/layout/notifications'
import { Context as SettingsContext, Settings } from 'lib/settings'
import { useRouter } from 'next/router'
import { getCurrentDate, parseDate } from 'lib/utils'

type CustomNextPage = NextPage & {
  noLayout?: boolean
}

type CustomAppProps = AppProps & {
  Component: CustomNextPage
}

export type EnhancedDate = Date & { isToday: boolean }

export const DateContext = createContext<EnhancedDate>(undefined!)

function MyApp ({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {
  const router = useRouter()

  // @ts-ignore
  const defaultDate: EnhancedDate = getCurrentDate()
  defaultDate.isToday = true
  const [date, setDate] = useState(defaultDate)

  useEffect(
    () => {
      const rawDate = router.query.date
      if (typeof rawDate !== 'string') {
        return
      }

      // @ts-ignore
      const date: EnhancedDate | null = parseDate(rawDate)
      if (date === null) {
        return
      }

      date.isToday = date.getTime() === getCurrentDate().getTime()
      setDate(date)
    },
    [router.isReady, router.query.date]
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

  return Component.noLayout === true
    ? <Component {...pageProps} />
    : (
      <div id="app" className="app">
        <SettingsContext.Provider value={[settings, updateSetting]}>
          <DateContext.Provider value={date}>
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <NotificationContainer>
              <Header />
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
