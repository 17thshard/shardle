import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html lang="en-US">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#a63737" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#282C34" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#0d5b90" />
          <meta name="description" content="Guess the Coppermind term in 6 tries. A new challenge is available each day." />

          <meta property="og:title" content="Shardle" />
          <meta
            property="og:description"
            content="Guess the Coppermind term in 6 tries. A new challenge is available each day."
          />
          <meta property="og:site_name" content="17th Shard" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/opengraph.webp`} />
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/opengraph.png`} />
          <meta
            property="og:image:alt"
            content="Logo showing stylized Cosmere starhart in the background with the title 'Shardle' overlayed"
          />
          <meta property="og:locale" content="en_US" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@17thShard" />
          <meta property="twitter:title" content="Shardle" />
          <meta
            property="twitter:description"
            content="Guess the Coppermind term in 6 tries. A new challenge is available each day."
          />
          <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_URL}/opengraph.webp`} />
          <meta
            property="twitter:image:alt"
            content="Logo showing stylized Cosmere starhart in the background with the title 'Shardle' overlayed"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,700;1,400&display=swap"
            rel="stylesheet"
          />
          <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@1&display=swap" rel="stylesheet" />
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

