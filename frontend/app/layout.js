"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import "./globals.css";

require("dotenv").config();

const { WALLETCONNECT_ID } = process.env;

const config = getDefaultConfig({
  appName: "Musicmint",
  projectId: WALLETCONNECT_ID,
  chains: [mainnet, polygon, sepolia],
  ssr: true, // if your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Layout>{children}</Layout>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
