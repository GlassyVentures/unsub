import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta content="#ffffff" name="theme-color" />
          <meta content="#ffffff" name="msapplication-TileColor" />
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
