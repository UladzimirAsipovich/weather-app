import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ModalProvider } from '../components/Modal/Modal';

function MyApp({ Component, pageProps }: AppProps) {

  let styles = [
    'background: red',
    'background: orange',
    'background: gold',
    'background: yellowgreen',
    'background: skyblue',
    'background: steelblue',
    'background: darkviolet'
  ];

  console.log('May I have your attention, please? Will the real read my');

  console.log('%c R %c E %c A %c D %c M %c E ',
    styles[0], styles[1], styles[2], styles[3],
    styles[4], styles[5]);

  return (
    <ModalProvider>
      <Component {...pageProps} />
    </ModalProvider>
  );
}

export default MyApp;
