import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
//= Components
import EditAlbum from "@/components/album/edit";

const EditAlbumMain: NextPage = () => {
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
        <EditAlbum />
      </main>
    </>
  );
};

export default EditAlbumMain;
