import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";

import { WagmiConfig } from "wagmi";
import { defaultWagmiConfig } from "@web3modal/wagmi/react";
import { modeTestnet } from "wagmi/chains";

import { UserProvider } from '@/utils/usercontext';


const mt = Montserrat({ subsets: ["vietnamese"] });

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
const chains = [modeTestnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId: projectId! });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <main className={mt.className}>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </main>
      </WagmiConfig>
    </>
  );
}
