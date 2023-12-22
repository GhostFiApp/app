import { createWeb3Modal, defaultWagmiConfig, useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useBalance } from 'wagmi';
import { modeTestnet } from 'wagmi/chains'

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
    const { address, isConnected } = useAccount();
    const { data } = useBalance({ address: address });
    const ethBalance = Number(parseFloat(data?.formatted || "0")).toFixed(3);

    return (
        <div className="flex">
            {isConnected ? (
                <>
                    <div className="px-1.5 hidden sm:inline-flex">
                        <div>
                            <button className="text-sm font-light">
                                <div
                                    onClick={() => modal.open()}
                                    className="flex rounded-lg px-3.5 py-1 border border-sec bg-sec text-black hover:bg-sec/50 hover:text-white font-semibold"
                                >
                                    {ethBalance} ETH
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
                                    {ethBalance} ETH
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
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
            )}
        </div>
    );
};

export default Connector