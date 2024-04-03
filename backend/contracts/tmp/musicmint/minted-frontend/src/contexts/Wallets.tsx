import React, { createContext, useContext, useState, useEffect } from "react";
import { WalletAggregator, BaseWallet } from "@polkadot-onboard/core";
import { InjectedWalletProvider } from "@polkadot-onboard/injected-wallets";
import {
  PolkadotWalletsContextProvider,
  useWallets as _useWallets,
} from "@polkadot-onboard/react";

const APP_NAME = "Polkadot Delegation Dashboard";

export type WalletState = "connected" | "disconnected";
export interface IWalletContext {
  wallet: BaseWallet | undefined;
}

const WalletContext = createContext({} as IWalletContext);
export const useWallets = () => useContext<IWalletContext>(WalletContext);

const WalletProviderInner = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<BaseWallet>();
  const { wallets } = _useWallets();
  const initiateWallets = async (wallets: Array<BaseWallet>) => {
    for (const wallet of wallets) {
      if (
        wallet.metadata.id == "allfeat" ||
        wallet.metadata.title == "allfeat"
      ) {
        await wallet.connect();
        setWallet(wallet);
      }
    }
  };

  useEffect(() => {
    if (wallets) {
      initiateWallets(wallets);
    }
  }, [wallets]);
  return (
    <WalletContext.Provider value={{ wallet: wallet }}>
      {children}
    </WalletContext.Provider>
  );
};

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const walletAggregator = new WalletAggregator([
    new InjectedWalletProvider({}, APP_NAME),
  ]);
  return (
    <PolkadotWalletsContextProvider
      walletAggregator={walletAggregator}
      initialWaitMs={1000}
    >
      <WalletProviderInner>{children}</WalletProviderInner>
    </PolkadotWalletsContextProvider>
  );
};

export default WalletProvider;
