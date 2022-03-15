import type { NextPage } from 'next'
import Head from 'next/head'

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Shardle - Not Found</title>
      </Head>
      <p style={{ color: 'var(--theme-text-color)', fontSize: '24px', textAlign: 'center', padding: '0 16px' }}>
        This page could not be found
      </p>
    </>
  )
}

(NotFound as any).hideNavigation = true

export default NotFound
