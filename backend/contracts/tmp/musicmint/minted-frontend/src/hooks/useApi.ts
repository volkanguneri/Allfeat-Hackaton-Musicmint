import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";
import { useProvider } from "./useProvider";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import keyring from "@polkadot/ui-keyring";

export const useApi = () => {
  const wsProvider = useProvider();
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    (async () => {
      let _api = await ApiPromise.create({ provider: wsProvider });
      setApi(_api);
      const { chainSS58, chainDecimals, chainTokens } = _api.registry;
      const { genesisHash } = _api;
      localStorage.setItem("chainSS58", JSON.stringify(chainSS58));
  
    })();
  }, [wsProvider]);

  return api;
};
