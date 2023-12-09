"use client";

// require("dotenv").config();

import "./globals.css";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
// import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";

import Navbar from "./components/Navbar";
import Header from "./components/Header/header";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

const { chains, publicClient } = configureChains(
  [hardhat, sepolia],
  // [publicProvider()]
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider(),
  ]
  // [infuraProvider({ apiKey: infuraId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains,
});
console.log("SEPOLIA_RPC_ID", infuraId);
console.log("PROJECT_ID", process.env.NEXT_PUBLIC_PROJECT_ID);
console.log("ALCHEMY_ID", process.env.NEXT_PUBLIC_ALCHEMY_ID);
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <Navbar />
            <Header />
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
