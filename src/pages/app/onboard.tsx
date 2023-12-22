import React, { useState, useEffect, ChangeEvent } from 'react';
import NavbarOnboard from '@/components/navbar';
import OnboardBar from '@/components/onboardbar'
import { useRouter } from "next/router";
import { useAccount, useContractWrite } from 'wagmi';
import TwitterAuth from '@/components/twitterauth'; //
import { useUser } from '../../utils/usercontext';
import { getDatabase, ref, push, set } from 'firebase/database';
import Particles from '../../utils/particles';
import { ProviderURL, ContractAddress } from '../../constants'


const onboard = () => {
    const [username, setUsername] = useState('');
    const { address } = useAccount();
    const router = useRouter();
    const [id, setId] = useState('');
    const [displayUsername, setDisplayUsername] = useState('');
    const [pfpURL, setPfpURL] = useState('');
    const { user } = useUser();
    const [tweetVerified, setTweetVerified] = useState<boolean>(false);

    const contractAddress = ContractAddress;
    const contractAbi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sharesSubject",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "buyGhost",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ];

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };


    function makeTweet(username: string) {
        const tweetMessage = `I am trying @GhostfiXYZ, the app to trade $GHOST about X creators on @modenetwork. 👻%0a%0aGo to the app and search for @${username} to be an early holder of my $GHOST! ⚡️`;
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${(tweetMessage)}`;
        window.open(twitterIntentUrl, '_blank');
    }

    useEffect(() => {
        if (user) {
            setId(user.uid);
            setDisplayUsername(user.displayName);
            setPfpURL(user.photoURL);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setId(user.uid);
            setDisplayUsername(user.displayName);
            setPfpURL(user.photoURL);
            const isDisplayNameTruthy = Boolean(user.displayName);
            setTweetVerified(isDisplayNameTruthy);
        }
    }, [user]);

    function goHome() {
        router.push('/app/home');
    }

    const { isLoading, isError, isSuccess, write } = useContractWrite({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'buyGhost',
    })


    async function sendTxForMint() {
        write({ args: [address, 1] });
        addToDatabase(username, displayUsername, address, pfpURL);
    }


    async function addToDatabase(username: string, displayUsername: string, address: string | undefined, pfpUrl: string) {
        try {
            if (address) {
                const db = getDatabase();
                const dbRef = ref(db, 'users');
                const newChildRef = push(dbRef);
                const randomChain = generateRandomChain();
                const newData = {
                    username: username,
                    displayUsername: displayUsername,
                    address: address,
                    pfpUrl: pfpUrl,
                    affId: randomChain,
                };
                await set(newChildRef, newData);
                console.log("Data added successfully!");
                await new Promise(resolve => setTimeout(resolve, 1500));
                goHome();
            } else {
                console.error("Address is undefined");
            }
        } catch (e) {
            console.error("Error adding data: ", e);
        }
    }

    function generateRandomChain() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    };
    return (
        <div>
            <NavbarOnboard />
            <OnboardBar />
            <div className="absolute inset-0 max-w-full mx-auto top-0 z-0 pointer-events-none">
                <Particles
                    className="absolute top-10 bottom-10 inset-0 z-0 pointer-events-none h-[800px] sm:h-[900px]"
                    quantity={50}
                />
            </div>
            <div className='pt-20'>
                <h2 className='flex items-center justify-center text-3xl font-semibold pt-5'>Welcome to <span className="text-sec ps-2">Ghostfi</span>.xyz!</h2>
                <span className="flex items-center justify-center text-sm text-gray-400">👻 The App to Trade <span className='text-sec font-semibold mx-1'>$GHOST</span> about X creators.</span>
                <h3 className="flex items-center justify-center text-medium text-white pt-8 font-semibold">1. Enter your X username 👇</h3>
                <div className="flex items-center justify-center bg-black bg-opacity-50 pt-3">
                    <input
                        className='border border-sec rounded-lg bg-sec/20 text-center font-semibold py-1'
                        placeholder='username'
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <h3 className="flex items-center justify-center text-medium text-white pt-8 font-semibold">
                    {username === '' ? (
                        <span>2. Tweet to confirm it's you ✍️</span>
                    ) : (
                        <span>2. Confirm that you are <span className='text-sec'>@{username}</span> ✍️</span>
                    )}
                </h3>
                <div className="flex items-center justify-center bg-black bg-opacity-50 pt-3">
                    <button className='border border-sec rounded-lg font-semibold bg-sec/20 text-center px-3 hover:text-black hover:bg-sec py-1' onClick={() => makeTweet(username)}>Tweet</button>
                </div>
                <h3 className="flex items-center justify-center text-medium text-white pt-8 font-semibold">3. Verify it's you ✅</h3>
                <div className="flex items-center justify-center bg-black bg-opacity-50 pt-3">
                    <TwitterAuth />
                </div>
                {tweetVerified === true && (
                    <>
                        <p className="flex items-center justify-center text-green-500 font-light pt-3">
                            Twitter verified!
                        </p>
                        <h3 className="flex items-center justify-center text-medium text-white pt-5 font-semibold">4. Mint your first <span className='text-sec px-2'>$GHOST</span> for FREE ⚡️</h3>
                        <div className="flex justify-center pt-3">
                            <button className='border border-sec text-white rounded-lg font-semibold bg-sec/20 text-center px-3 hover:text-black hover:bg-sec py-1' onClick={() => sendTxForMint()}>Mint</button>
                        </div>
                    </>
                )}
                {isLoading === true && <div><p className="flex items-center justify-center text-green-500 font-light pt-3">Loading...</p></div>}
                {isError === true && <div>
                    <p className="flex items-center justify-center text-red-500 font-light pt-3">
                        Transaction error. Please try again.
                    </p></div>}
                {isSuccess === true && (
                    <div>
                        <p className="flex items-center justify-center text-green-500 font-light pt-3">Transaction success!</p>
                        <h3 className="flex items-center justify-center text-medium text-white pt-5 font-semibold">5. Create your account 🔥</h3>
                        <div className="flex justify-center pt-3">
                            <button className='border border-sec text-white rounded-lg font-semibold bg-sec/20 text-center px-3 hover:text-black hover:bg-sec py-1' onClick={() => addToDatabase(username, displayUsername, address, pfpURL)}>Create</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default onboard;