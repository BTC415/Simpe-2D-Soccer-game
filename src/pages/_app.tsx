import '../common/styles/global.css';
import { MotionConfig } from 'framer-motion';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import GameProvider from '@/common/context/gameContext';
import ModalManager from '@/modules/modal';

import 'react-toastify/dist/ReactToastify.min.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>BALLZONE - play now!</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="2D (top-down perspective) real-time game with 2 teams where players try to score a goal and win (like in soccer or hockey)."
        />
        <meta name="keywords" content="ball, game, soccer, football" />
      </Head>
      <ToastContainer theme="dark" />
      <MotionConfig transition={{ ease: [0.6, 0.01, -0.05, 0.9] }}>
        <GameProvider>
          <ModalManager>
            <Component {...pageProps} />
          </ModalManager>
        </GameProvider>
      </MotionConfig>
    </>
  );
};

export default App;
