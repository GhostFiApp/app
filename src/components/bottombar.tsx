import React from 'react'
import Link from 'next/link'

const BottomBar = () => {
    return (
        <div>
            <div className="fixed bottom-0 w-full flex justify-center bg-black">
                <div className="grid grid-cols-4 p-4 border-t border-t-sec rounded-2xl shadow-lg items-center">
                    <Link href="/app/home" className="mx-3 flex flex-col items-center">
                        <img src="/home.png" alt="Home" className="h-9 w-9 items-center" />
                        <span className="pt-3 font-semibold text-xs">HOME</span>
                    </Link>
                    <Link href="/app/ranking" className="mx-3 flex flex-col items-center">
                        <img src="/star.png" alt="Secret" className="h-9 w-9 items-center" />
                        <span className="pt-3 font-semibold text-xs">RANKING</span>
                    </Link>
                    <Link href="/app/explore" className="mx-3 flex flex-col items-center">
                        <img src="/explore.png" alt="Explore" className="h-9 w-9 items-center" />
                        <span className="pt-3 font-semibold text-xs">EXPLORE</span>
                    </Link>
                    <Link href="/app/airdrop" className="mx-3 flex flex-col items-center">
                        <img src="/airdrop.png" alt="Airdrop" className="h-9 w-9 items-center" />
                        <span className="pt-3 font-semibold text-xs">AIRDROP</span>
                    </Link>
                </div>
                <div className='fixed -bottom-0'></div>
            </div>
        </div>
    )
}

export default BottomBar
