import { createWeb3Modal, defaultWagmiConfig, useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi';
import { modeTestnet } from 'wagmi/chains'
import { useEffect } from "react";
import { useRouter } from "next/router";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
const chains = [modeTestnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId: projectId! });

createWeb3Modal({
    wagmiConfig,
    projectId: projectId!,
    chains,
    themeMode: "dark",
    themeVariables: {
        "--w3m-color-mix": "#12fb16",
        "--w3m-color-mix-strength": 25,
        "--w3m-accent": "#fff",
        "--w3m-z-index": 1000,
    },
});

const Connector = () => {
    const modal = useWeb3Modal();
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            router.push('/app/dispatch/');
        } else {
            router.push('/')
        }
    }, [isConnected]);

    return (
        <div className="flex">
            <>
                <div className="px-1.5 hidden sm:flex">
                    <div>
                        <button className="text-sm font-light">
                            <div
                                onClick={() => modal.open()}
                                className="flex rounded-lg px-3.5 py-1 border border-sec bg-sec text-black hover:bg-sec/50 hover:text-white font-semibold"
                            >
                                Connect Wallet
                            </div>
                        </button>
                    </div>
                </div>
                <div className="px-1.5 sm:hidden flex">
                    <div>
                        <button className="text-sm font-light">
                            <div
                                onClick={() => modal.open()}
                                className="flex rounded-lg px-3.5 py-1 border border-sec bg-sec text-black hover:bg-sec/50 hover:text-white font-semibold"
                            >
                                Connect
                            </div>
                        </button>
                    </div>
                </div>
            </>
        </div>
    );
};

export default Connector