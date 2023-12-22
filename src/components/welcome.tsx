import React from 'react'
import ConnectWalletHome from '@/components/connectorhome'
import MobileInstallModal from '@/components/mobileinstallmodal';

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
