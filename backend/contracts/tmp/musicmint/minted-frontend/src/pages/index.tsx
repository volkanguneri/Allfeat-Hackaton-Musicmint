import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
//= Layout
import MainLayout from "@/layouts/Main";
//= Components
import Header from "@/components/Home/Header";
import Projects from "@/components/Home/Projects";
import Features from "@/components/Home/Features";
import Process from "@/components/Home/Process";
import Collections from "@/components/Home/Collections";
import Community from "@/components/Home/Community";

const Home: NextPage = () => {
  useEffect(() => {
    document.body.classList.add("home-style-12");
    return () => document.body.classList.remove("home-style-12");
  }, []);

  return (
    <>
      <Head>
        <title>MintedWave - NFT Marketplace</title>
      </Head>

      <Header />
      <main>
        <Projects />
        <Features />
        <Process />
        <Collections />
        <Community />
      </main>
    </>
  );
};

export default Home;
