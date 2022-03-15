import Game, { GameResult } from 'components/Game'
import Statistics from 'components/modals/Statistics'
import type { NextPage } from 'next'
import Head from 'next/head'
import { addResult, getResult } from 'lib/store'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Settings from 'components/modals/Settings'
import { DateContext } from 'lib/dates'
import Info from 'components/modals/Info'

const Home: NextPage = () => {
  const router = useRouter()
  const date = useContext(DateContext)
  const [activeModal, setActiveModal] = useState<string>()
  const [result, setResult] = useState<GameResult | null>(null)
  const [firstVisitOutstanding, setFirstVisitOutstanding] = useState(true)

  useEffect(
    () => {
      if (window.localStorage.getItem('has-visited') === 'true') {
        setFirstVisitOutstanding(false)
      }
    },
    []
  )


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

  function closeInfo () {
    if (firstVisitOutstanding) {
      setFirstVisitOutstanding(false)
      window.localStorage.setItem('has-visited', 'true')
      return
    }

    router.push('#', undefined, { scroll: false })
  }

  return (
    <>
      <Head>
        <title>Shardle</title>
      </Head>
      <Game onDone={onDone} />
      <Info visible={activeModal === 'info' || firstVisitOutstanding} close={closeInfo} />
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
