import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
//= Components
import Projects from "@/components/Discover/Projects";

const Discover: NextPage = () => {
  useEffect(() => {
    document.body.classList.add("home-style-12");
    return () => document.body.classList.remove("home-style-12");
  }, []);

  return (
    <>
      <Head>
        <title>MintedWave - Discover NFTs</title>
      </Head>

      <main>
        <Projects />
      </main>
    </>
  );
};

export default Discover;
