import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "react-circular-progressbar/dist/styles.css";

import Footer from "../components/footer";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AEBot - بوت موقع اكوام وعرب سيد وايجي بيست</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f3f4f6" />
        <link rel="apple-touch-icon" href="/favicon-96x96.png" />
        <meta name="apple-mobile-web-app-status-bar" content="#f3f4f6" />
        <meta name="application-name" content="AEBot" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AEBot" />
        <meta
          name="title"
          content="AEBot - بوت موقع اكوام وعرب سيد وايجي بيست"
        />
        <meta
          name="description"
          content="بوت لموقع ايجي بيست واكوام وعرب سيد بيجيبلك لينكات المسلسلات المباشره عشان تحملها من غير اعلانات وبدوسه واحده بس!"
        />
        <meta
          name="keywords"
          content="اكوام الجديد,اكوام القديم,عرب سيد,ايجي بيست,arabseed,akoam,old akoam"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="Arabic" />
        <meta name="author" content="nasrika.com" />
      </Head>
      <ToastContainer dir="rtl" />

      <Component {...pageProps} />

      <Footer />
    </>
  );
}

export default MyApp;
