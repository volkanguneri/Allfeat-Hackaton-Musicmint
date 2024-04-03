import { useEffect, useRef } from "react";
import Head from "next/head";
//= Scripts
import navbarScrollEffect from "@/common/navbarScrollEffect";
//= Components
import BlogSlider from "@/components/Blog/BlogSlider";
import AllNews from "@/components/SinglePost/AllNews";
import PopularPosts from "@/components/SinglePost/PopularPosts";

const PageSinglePost5 = () => {
  const navbarRef = useRef(null);

  useEffect(() => {
    navbarScrollEffect(navbarRef.current, true);
    document.body.classList.add("home-style-12");
    return () => document.body.classList.remove("home-style-12");
  }, [navbarRef]);

  return (
    <>
      <Head>
        <title>MintedWave - NFT Marketplace</title>
      </Head>

      <main className="blog-page style-5 color-5">
        <BlogSlider />
        <AllNews />
        <PopularPosts />
      </main>
    </>
  );
};

export default PageSinglePost5;
