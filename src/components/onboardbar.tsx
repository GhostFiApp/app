import React from 'react'

const OnboardBar = () => {
    return (
        <div className='bg-sec py-1 pt-12'>
            <span className='flex text-center justify-center mx-auto text-black font-semibold text-[8px] sm:text-xs'>
                To use Ghostfi.xyz, you first need to bridge testnet ETH 👉<a href='https://bridge.mode.network/' className='underline hover:text-slate-900 mx-1'>bridge.mode.network</a>
            </span>
        </div >
    )
}

export default OnboardBar