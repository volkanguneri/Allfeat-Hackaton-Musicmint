import { useMemo } from "react";
import { WsProvider } from "@polkadot/api";

export const useProvider = () => {
  return useMemo(() => {
    const wsProvider = new WsProvider("wss://rpc-test.allfeat.io");

    return wsProvider
  }, []);
};
