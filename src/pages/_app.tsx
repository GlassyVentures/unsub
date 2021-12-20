import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PlausibleProvider from 'next-plausible'
import Head from 'next/head'
import { DefaultSeo } from 'components/SEO'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="unsub.email">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo />
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}

export default MyApp
