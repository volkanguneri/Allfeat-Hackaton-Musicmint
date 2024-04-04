"use client";
import { WalletButton } from "@rainbow-me/rainbowkit/dist/components/ConnectOptions/MobileOptions";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="flex items-center justify-center max-w-full gap-80">
      <div className="flex-grow">
        <h2>Musicmint</h2>
      </div>
      <Navbar />
      <WalletButton />
    </header>
  );
};

export default Header;
