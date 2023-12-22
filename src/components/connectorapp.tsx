import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useBalance, useAccount } from 'wagmi';
import axios from 'axios';
import LogOutButton from '@/components/logoutbutton'
import MyWalletButton from '@/components/mywalletbutton';
import 'firebase/database';
// import { db as firebaseDb } from '../../firebase';

interface User {
    username: string;
}

const ConnectorApp = () => {
    const { address } = useAccount();
    const router = useRouter();
    const [isWalletOpen, setWalletOpen] = useState(false);
    const [ethPrice, setEthPrice] = useState('...');
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isDisplayResults, setDisplayResults] = useState(false);
    const [isResultsLoading, setResultsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const { data, isError, isLoading } = useBalance({
        address: address,
    });

    const formattedEthBalance = (typeof data?.formatted === 'string' ? parseFloat(data.formatted) : data?.formatted || 0).toFixed(4);

    function openWallet() {
        setWalletOpen(true);
    }

    function closeWallet() {
        setWalletOpen(false);
    }

    async function getEthPrice() {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const price = response.data['ethereum'].usd;
        setEthPrice(price.toFixed(2));
    }

    useEffect(() => {
        if (address === undefined) {
            router.push('/')
        }
    }, [address]);

    useEffect(() => {
        getEthPrice();
    }, []);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    function openSearch() {
        setSearchOpen(true);
        setWalletOpen(false);
    }

    function closeSearch() {
        setSearchOpen(false);
    }

    useEffect(() => {
        if (searchInput) {
            // loadSearchResults(searchInput);
            setDisplayResults(true);
        }
    })


    // async function loadSearchResults(searchInput: string) {
    //     setResultsLoading(true);
    //     console.log('Searching for user:', searchInput);
    //     if ('ref' in db) {
    //         const querySnapshot = await db
    //             .ref('users')
    //             .orderByChild('username')
    //             .equalTo(searchInput)
    //             .once('value');
    //         if (querySnapshot.exists()) {
    //             const users: Record<string, User> = querySnapshot.val();
    //             const userArray: User[] = Object.values(users);
    //             setSearchResults(userArray);
    //             console.log('User found:', userArray);
    //         } else {
    //             setSearchResults([]);
    //             console.log('User not found');
    //         }
    //     }

    //     setResultsLoading(false);
    // }

    function bridgeETH() {
        router.push('https://bridge.mode.network/')
    }

    return (
        <div className="flex">
            <div className='items-center rounded-xl border border-sec bg-sec/20 px-2 py-1 font-semibold text-white sm:flex hover:bg-sec hover:text-black'>
                <button onClick={openWallet} className="flex items-center space-x-2">
                    <img src="/eth.png" alt="" className="h-4 w-4" />
                    <span className="font-semibold text-sm whitespace-nowrap">
                        {isLoading ? 'Fetching balance...' : isError ? 'Error fetching balance' : `${formattedEthBalance} ETH`}<span className='px-2 sm:px-0'></span>
                    </span>
                </button>
                {isWalletOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" >
                        <div className="bg-black border border-sec p-4 rounded-lg shadow-lg">
                            <div className='flex items-center px-2.5'>
                                <span className='text-white text-sm font-extrabold justify-start flex items-center'>
                                    <img src="/eth.png" alt="" className="h-4 w-4 mr-1" />
                                    ETH →
                                    <span className='text-sec px-1'>${ethPrice}</span>
                                </span>
                                <button onClick={closeWallet} className='border border-sec bg-sec/20 hover:bg-sec hover:text-black rounded-full p-2 ml-auto'>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.95 8.464a1 1 0 0 0-1.414-1.414L12 10.586 8.464 7.05A1 1 0 1 0 7.05 8.464L10.586 12 7.05 15.536a1 1 0 1 0 1.414 1.414L12 13.414l3.536 3.536a1 1 0 0 0 1.414-1.414L13.414 12l3.536-3.536Z" fill="#fff" className='' />
                                    </svg>
                                </button>
                            </div>
                            <MyWalletButton />
                            <div className="text-white pt-4 flex justify-center">
                                <button onClick={bridgeETH} className="flex items-center justify-center rounded-xl border border-sec bg-sec/20 hover:bg-sec hover:text-black w-64 px-4 py-1">
                                    <svg width="18" height="18" className="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z" /><path d="M18 4a1 1 0 0 1 .993.883L19 5v1.565l.116.101.277.231c.05.042.104.084.158.126.533.415 1.177.832 1.765 1.028a1 1 0 1 1-.632 1.898 6.864 6.864 0 0 1-1.43-.694L19 9.091V14h3a1 1 0 0 1 .117 1.993L22 16h-3v3a1 1 0 0 1-1.993.117L17 19v-3H7v3a1 1 0 0 1-1.993.117L5 19v-3H2a1 1 0 0 1-.117-1.993L2 14h3V9.09c-.496.331-1.078.657-1.684.859a1 1 0 0 1-.632-1.898c.588-.196 1.232-.613 1.765-1.028l.158-.126.277-.231L5 6.565V5a1 1 0 0 1 1.993-.117L7 5v1.722a4.758 4.758 0 0 0 .937.997C8.71 8.338 9.993 9 12 9c2.007 0 3.29-.662 4.063-1.28.393-.315.664-.626.832-.851L17 6.722V5a1 1 0 0 1 1-1Zm-1 5.517a7.552 7.552 0 0 1-1.666.895l-.334.121V14h2V9.517Zm-4 1.436a10.486 10.486 0 0 1-1.677.026L11 10.953V14h2v-3.047ZM7 9.517V14h2v-3.467l-.334-.12a7.605 7.605 0 0 1-1.428-.733L7 9.517Z" fill="#12fb16" /></g></svg>
                                    Bridge
                                </button>
                            </div>
                            <div className="text-white pt-4 flex justify-center">
                                <button onClick={openSearch} className="flex items-center justify-center rounded-xl border border-sec bg-sec/20 hover:bg-sec hover:text-black w-64 px-4 py-1">
                                    <svg width="18" height="18" className="mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="#12fb16" d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1 8.05-9.12A8.251 8.251 0 1 0 15.25.01V0zm0 15a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5z" />
                                    </svg>
                                    Search
                                </button>
                            </div>
                            <LogOutButton />
                        </div>
                    </div>
                )}
                {isSearchOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="bg-black border border-white p-4 rounded-lg shadow-lg">
                            <div className="text-white">
                                <div className='flex items-center px-2.5 mx-4'>
                                    <label className="block mx-5">Search by username</label>
                                    <button onClick={closeSearch} className='border border-sec bg-sec/20 hover:bg-sec hover:text-black rounded-full p-2 ml-auto'>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.95 8.464a1 1 0 0 0-1.414-1.414L12 10.586 8.464 7.05A1 1 0 1 0 7.05 8.464L10.586 12 7.05 15.536a1 1 0 1 0 1.414 1.414L12 13.414l3.536 3.536a1 1 0 0 0 1.414-1.414L13.414 12l3.536-3.536Z" fill="#fff" className='' />
                                        </svg>
                                    </button>
                                </div>
                                <div className='pt-3'></div>
                                <div className='mx-auto flex justify-center items-center text-center'>
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={handleSearchInputChange}
                                        placeholder='Username'
                                        className="w-full px-3 py-1 rounded-lg border border-sec bg-sec/20 text-white"
                                    />
                                </div>
                            </div>
                            {isDisplayResults && (
                                <div className='pt-2'>
                                    <label className="mx-1 text-xs font-light text-white">Search Results:</label>
                                    {isResultsLoading ? (
                                        <div className='pt-3 font-light text-xs mx-auto justify-center flex text-white'>Loading...</div>
                                    ) : (
                                        <div className='pt-3 text-white'>
                                            {searchResults.length > 0 ? (
                                                <ul>
                                                    {searchResults.map((user, index) => (
                                                        <li key={index}>{user.username}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className='font-light text-xs mx-auto justify-center flex'>No results found.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectorApp