import '../common/styles/global.css';
import { MotionConfig } from 'framer-motion';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import AdminProvider from '@/common/context/adminContext';
import ModalManager from '@/modules/modal';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>BALLZONE - play now!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MotionConfig transition={{ ease: [0.6, 0.01, -0.05, 0.9] }}>
        <AdminProvider>
          <ModalManager>
            <Component {...pageProps} />
          </ModalManager>
        </AdminProvider>
      </MotionConfig>
    </>
  );
};

export default App;
