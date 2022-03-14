import Game, { GameResult } from 'components/Game'
import Statistics from 'components/Statistics'
import type { NextPage } from 'next'
import Head from 'next/head'
import { addResult, getResult } from 'lib/store'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Settings from 'components/Settings'
import { DateContext } from 'pages/_app'

const Home: NextPage = () => {
  const router = useRouter()
  const date = useContext(DateContext)
  const [activeModal, setActiveModal] = useState<string>()
  const [result, setResult] = useState<GameResult | null>(null)

  useEffect(
    () => {
      setResult(getResult(date))
    },
    [date]
  )

  useEffect(
    () => {
      function onHashChange (rawUrl: string) {
        const url = new URL(rawUrl, window.location.href)
        setActiveModal(url.hash.startsWith('#') ? url.hash.substring(1) : undefined)
      }

      setActiveModal(window.location.hash.startsWith('#') ? window.location.hash.substring(1) : undefined)

      router.events.on('hashChangeStart', onHashChange)

      return () => {
        router.events.off('hashChangeStart', onHashChange)
      }
    },
    [router.events]
  )

  function onDone (result: GameResult) {
    addResult(date, result)
    setResult(result)
    setTimeout(
      () => {
        router.push(`#statistics`, undefined, { scroll: false })
      },
      1500
    )
  }

  return (
    <>
      <Head>
        <title>Shardle</title>
      </Head>
      <Game onDone={onDone} />
      <Statistics
        visible={activeModal === 'statistics'}
        gameResult={result}
        close={() => router.push('#', undefined, { scroll: false })}
      />
      <Settings visible={activeModal === 'settings'} close={() => router.push('#', undefined, { scroll: false })} />
    </>
  )
}

export default Home
