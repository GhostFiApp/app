import React from 'react'
import ConnectWalletHome from '@/components/connectorhome'
import MobileInstallModal from '@/components/mobileinstallmodal';
import Link from 'next/link';

const Welcome = () => {

    const addNetwork = async () => {
        if ((window as any).ethereum) {
            const ethereum = (window as any).ethereum;
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0x397',
                        chainName: 'Mode Testnet',
                        nativeCurrency: {
                            name: 'ETH',
                            symbol: 'ETH',
                            decimals: 18,
                        },
                        rpcUrls: ['https://sepolia.mode.network'],
                        blockExplorerUrls: ['https://sepolia.explorer.mode.network'],
                    },
                ],
            });
        } else {
            console.error('MetaMask not installed');
        }
    };

    return (
        <div>
            <div className="flex-col items-center justify-center text-center pt-60 sm:pt-52">
                <img src="/ghost.png" alt="ghostfi.xyz logo" className="mx-auto w-28 h-28" />
                <h1 className="text-4xl font-semibold pt-8"><span className="text-sec">Ghostfi</span>.xyz</h1>
                <span className="text-[13px] text-gray-400">Trade <span className='text-sec font-semibold'>$GHOST</span> about X creators.</span>
                <div className="pt-5 justify-center flex mx-auto">
                    <ConnectWalletHome />
                </div>
                <>
                    <div className="px-1.5">
                        <div>
                            <button className="text-sm font-light pt-2">
                                <div onClick={addNetwork} className="flex rounded-lg px-[38px] py-1 border border-sec bg-sec/20 text-sec hover:bg-sec hover:text-black font-semibold">
                                    Add Mode Testnet
                                </div>
                            </button>
                        </div>
                    </div>
                </>
                <div id="terms" className="text-gray-400 text-[8px] pt-6">Built w/ 💚 for <a href="https://www.mode.network/hackathon" className='hover:underline text-sec/80'>Mode DeFi Degen Hack</a> by <a href="https://github.com/xtycoonfi" className='hover:underline text-sec/80'>@xtycoon</a></div>
                <div id="social" className='flex items-center justify-center pt-5'>
                    <Link href="https://twitter.com/GhostfiXYZ" className="mx-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#12fb16"><path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" /></svg>
                    </Link>
                    <Link href="https://github.com/GhostfiApp" className="mx-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#12fb16"><path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.636 3.636 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2.001 2.001 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.104 2.104 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.892 3.892 0 0 1 1.025-2.688 3.594 3.594 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.427 9.427 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.593 3.593 0 0 1 .1 2.65 3.869 3.869 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.563 4.937a2.368 2.368 0 0 1 .675 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247Z" /></svg>
                    </Link>
                </div>
                <MobileInstallModal />
                <div className='pt-32'></div>
            </div>
            <div>
                <div className="fixed bottom-0 w-full flex justify-center bg-black">
                    <div className="items-center">
                        <span className='text-[8px] text-gray-400'>A <span className='text-sec'>$GHOST</span> is not a financial instrument.
                            <span></span>
                            <span className='px-0.5'>It does not promise any future returns.</span></span>
                        <div className='fixed bottom-2'></div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Welcome
