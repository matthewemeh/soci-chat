import Head from 'next/head';
import type { AppProps } from 'next/app';

import '../styles/index.scss';
import '../styles/globals.scss';
import '../styles/register.scss';
import '../styles/verify-email.scss';

import AuthContextProvider from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Head>
        <title>Soci Chat</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <main>
        <Component {...pageProps} />

        <div id='alert' style={{ bottom: '-100px' }} />
      </main>
    </AuthContextProvider>
  );
}
