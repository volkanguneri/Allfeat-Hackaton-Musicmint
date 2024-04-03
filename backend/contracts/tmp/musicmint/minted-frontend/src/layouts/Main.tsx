//= React
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
//= Components
import PreLoader from "@/components/PreLoader";
import WalletProvider from "@/contexts/Wallets";
import ScrollToTop from "@/components/ScrollToTop";
//= Scripts
import fixStylesheetsOrder from "@/common/fixStylesheetsOrder";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  // useEffect(() => {
  //   fixStylesheetsOrder(isRTL);
  // }, [isRTL]);

  return (
    <>
      {/* <Head>
        <link rel="stylesheet" href="/assets/css/lib/bootstrap-icons.css" />
        <link rel="stylesheet" href="/assets/css/lib/all.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/animate.css" />
        <link rel="stylesheet" href="/assets/css/lib/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />

      </Head> */}

      {/* <PreLoader /> */}

      <WalletProvider>
        <Navbar />
        {children}
        <Footer />
      </WalletProvider>

      <ScrollToTop />
    </>
  );
};

export default MainLayout;
