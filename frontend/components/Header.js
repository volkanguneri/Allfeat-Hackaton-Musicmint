"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
export const YourApp = () => {
  return <ConnectButton />;
};
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="flex items-center justify-center max-w-full gap-80 mt-6 mb-60">
      <div className="mr-auto">
        <h2>Musicmint</h2>
      </div>
      <Navbar />
      <ConnectButton />
    </header>
  );
};

export default Header;
