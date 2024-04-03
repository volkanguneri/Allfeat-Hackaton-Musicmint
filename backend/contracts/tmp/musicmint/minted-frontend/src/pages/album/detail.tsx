import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
//= Components
import DetailAlbum from "@/components/album/detail";

const DetailAlbumMain: NextPage = () => {
  useEffect(() => {
    document.body.classList.add("home-style-12");
    return () => document.body.classList.remove("home-style-12");
  }, []);

  return (
    <>
      <Head>
        <title>MintedWave - Edit Album</title>
      </Head>

      <main>
        <DetailAlbum />
      </main>
    </>
  );
};

export default DetailAlbumMain;
