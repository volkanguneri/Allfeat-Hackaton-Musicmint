import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";

import dynamic from "next/dynamic";
const CreateProfile = dynamic(() => import("@/components/Profile"), {
  ssr: false,
});

const Profile: NextPage = () => {
  useEffect(() => {
    document.body.classList.add("home-style-12");
    return () => document.body.classList.remove("home-style-12");
  }, []);

  return (
    <>
      <Head>
        <title>MintedWave - Profile Page</title>
      </Head>

      <main>
        <CreateProfile />
      </main>
    </>
  );
};

export default Profile;
