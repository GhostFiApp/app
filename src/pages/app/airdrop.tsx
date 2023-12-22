import React, { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import BottomBar from '@/components/bottombar'
import Image from 'next/image'
import { ref, onValue } from 'firebase/database';
import { db } from '../../../firebase';
import { useAccount } from 'wagmi';

interface User {
    address: string;
    affId: string;
}

const airdrop = () => {
    const [copyButtonText, setCopyButtonText] = useState('https://app.ghostfi.xyz/soon');
    const { address } = useAccount();
    const [userData, setUserData] = useState<User | undefined>(undefined);

    useEffect(() => {
        async function fetchUserData() {
            if (address) {
                const usersRef = ref(db, 'users');
                onValue(usersRef, (snapshot) => {
                    const usersData = snapshot.val();
                    if (usersData) {
                        const usersArray: User[] = Object.values(usersData) as User[];
                        const user = usersArray.find(user => user.address === address);
                        if (user) {
                            setUserData(user);
                            setCopyButtonText(generateAffLink(user.affId));
                        }
                    }
                });
            }
        }
        fetchUserData();
    }, [address]);


    function generateAffLink(affId: string) {
        return `https://app.ghostfi.xyz/u/${affId || 'soon'}`;
    }

    function copyLink() {
        const inviteLink = generateAffLink(userData?.affId || 'soon');
        navigator.clipboard.writeText(inviteLink).then(() => {
            setCopyButtonText('Copied!');
        });
    }

    function copyLinkID() {
        const inviteLink = generateAffLink(userData?.affId || 'soon');
        navigator.clipboard.writeText(inviteLink);
    }

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center pt-28">
                <div className="text-center">
                    <div className='pt-5 sm:pt-8'></div>
                    <Image src="/$GHOST.png" alt='logo $GHOST' width={195} height={195} />
                    <div className='pt-5 sm:pt-5'></div>
                    <h1 className='text-center font-semibold text-4xl text-white'>$GHOST</h1>
                    <h2 className='text-center font-semibold text-xl text-sec uppercase'>Coming soon!</h2>
                    <div className='pt-5'></div>
                    <hr />
                </div>
            </div>
            <p className='pt-5 text-center font-semibold text-xs text-white'>Invite your friends via your personalised link & win</p>
            <p className='text-center font-semibold text-xs text-white'>bonuses soon to be redeemed on <span className='text-sec'>ghostfi</span>.xyz!</p>
            <h3 className='pt-5 text-center font-semibold text-xs text-white mx-5'>
                Your invite link:
                <span className='px-1'></span>
                <button onClick={copyLink} className="rounded-xl border-sec bg-sec/20 px-2 py-1 font-semibold text-sec hover:bg-sec hover:text-black mt-4">
                    {copyButtonText}
                </button>
            </h3>
            {userData && userData.affId && (
                <div className='pt-5 text-center font-semibold text-xs text-white mx-5'>
                    <h3 className='text-center font-semibold text-xs text-white mx-5'>
                        Your invite ID:
                        <span className='px-1'></span>
                        <button onClick={copyLinkID} className="rounded-xl border-sec bg-sec/20 px-2 py-1 font-semibold text-sec hover:bg-sec hover:text-black mt-4">
                            #{userData.affId}
                        </button>
                    </h3>
                </div>
            )}
            <h3 className='pt-5 text-center font-semibold text-xs text-white mx-5'>
                Your rank:
                <span className='px-1'></span>
                <span className='text-sm text-sec pt-10'>#????</span>
            </h3>
            <BottomBar />
        </div>
    )
}

export default airdrop
