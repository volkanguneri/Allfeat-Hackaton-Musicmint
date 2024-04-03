import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
//= Components
import Album from "@/components/album";

const AlbumMain: NextPage = () => {
  useEffect(() => {
    document.body.classList.add("home-style-12");
    return () => document.body.classList.remove("home-style-12");
  }, []);

  return (
    <>
      <Head>
        <title>MintedWave - Albums</title>
      </Head>

      <main>
        <Album />
      </main>
    </>
  );
};

export default AlbumMain;
