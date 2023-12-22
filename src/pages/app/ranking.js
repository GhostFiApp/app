import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/navbar';
import BottomBar from '@/components/bottombar';
import ABI from '../../utils/ABI.json';
import { ethers } from 'ethers';
import { ref, get } from 'firebase/database';
import { db } from '../../../firebase';
import { ProviderURL, ContractAddress } from '../../constants'


const Explore = () => {
    const contractAddress = ContractAddress;
    const contractAbi = ABI;
    const providerUrl = ProviderURL;
    const [tradeEvents, setTradeEvents] = useState([]);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const [usernames, setUsernames] = useState({});
    const [displayReloadButton, setDisplayReloadButton] = useState(false);
    const [displayContent, setDisplayContent] = useState('Top');
    const [users, setUsers] = useState([]);
    const [userBuyPrices, setUserBuyPrices] = useState({});
    //const [numberOfHolders, setNumberOfHolders] = useState({});

    const showReloadButtonAfterDelay = useCallback(() => {
        setTimeout(() => {
            setDisplayReloadButton(true);
        }, 3000);
    }, []);

    useEffect(() => {
        const provider = new ethers.JsonRpcProvider(providerUrl);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);
        async function fetchTradeEvents() {
            try {
                const blockNumber = await provider.getBlockNumber();
                const filter = contract.filters.Trade(null, null, null, null, null, null, null, null, null);
                const events = await contract.queryFilter(filter, blockNumber - 90000, blockNumber);
                setTradeEvents(events);
                setLoading(false);
                showReloadButtonAfterDelay();
            } catch (error) {
                console.error('Error fetch events', error);
                setLoading(false);
            }
        }
        fetchTradeEvents();
    }, [showReloadButtonAfterDelay]);

    useEffect(() => {
        async function fetchUsernames() {
            try {
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                const usersData = snapshot.val();
                if (usersData) {
                    const usernamesData = Object.values(usersData).reduce(
                        (acc, user) => ({ ...acc, [user.address]: user }),
                        {}
                    );
                    setUsernames(usernamesData);
                }
            } catch (error) {
                console.error('Error fetch usernames', error);
            }
        }
        fetchUsernames();
    }, []);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setUserLoading(true);
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                const usersData = snapshot.val();
                const provider = new ethers.JsonRpcProvider(providerUrl);
                const contract = new ethers.Contract(contractAddress, contractAbi, provider);
                if (usersData) {
                    const userList = Object.values(usersData);
                    const buyPrices = {};
                    await Promise.all(
                        userList.map(async (user) => {
                            const buyPriceAfterFeeWei = await contract.getBuyPriceAfterFee(user.address, 1);
                            const buyPriceAfterFeeString = buyPriceAfterFeeWei.toString();
                            const buyPriceAfterFeeEtherDivided = parseFloat(buyPriceAfterFeeString) / 1e18;
                            const buyPriceAfterFeeFormatted = buyPriceAfterFeeEtherDivided.toFixed(5);
                            buyPrices[user.address] = buyPriceAfterFeeFormatted;
                        })
                    );
                    const sortedUsers = userList.sort((user1, user2) => {
                        const price1 = parseFloat(buyPrices[user1.address] || 0);
                        const price2 = parseFloat(buyPrices[user2.address] || 0);
                        return price2 - price1;
                    });
                    const top50Users = sortedUsers.slice(0, 50);
                    setUsers(top50Users);
                    setUserBuyPrices(buyPrices);
                    setUserLoading(false);
                }
            } catch (error) {
                console.error('Error fetch users', error);
                setUserLoading(false);
            }
        }
        if (displayContent === 'Top') {
            fetchUsers();
        }
    }, [displayContent]);

    // useEffect(() => {
    //     async function fetchNumberOfHolders() {
    //         try {
    //             const provider = new ethers.JsonRpcProvider(providerUrl);
    //             const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    //             const holdersPromises = users.map(async (user) => {
    //                 const buyers = await contract.getBuyersForSubject(user.address);
    //                 const uniqueBuyers = new Set(buyers);
    //                 return uniqueBuyers.size;
    //             });
    //             const numberOfHoldersArray = await Promise.all(holdersPromises);
    //             const numberOfHoldersMap = users.reduce((acc, user, index) => {
    //                 acc[user.address] = numberOfHoldersArray[index];
    //                 return acc;
    //             }, {});
    //             setNumberOfHolders(numberOfHoldersMap);
    //         } catch (error) {
    //             console.error('Error fetch number of holders', error);
    //         }
    //     }
    //     if (displayContent === 'Top') {
    //         fetchNumberOfHolders();
    //     }
    // }, [displayContent, providerUrl, contractAddress, contractAbi, users]);

    // useEffect(() => {
    //     async function fetchNumberOfHolders() {
    //         try {
    //             const provider = new ethers.JsonRpcProvider(providerUrl);
    //             const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    //             const numberOfHoldersMap = {};
    //             const uniqueAddresses = new Set();
    //             await Promise.all(
    //                 users.map(async (user) => {
    //                     const buyers = await contract.getBuyersForSubject(user.address);
    //                     buyers.forEach((address) => {
    //                         if (!uniqueAddresses.has(address)) {
    //                             uniqueAddresses.add(address);
    //                         }
    //                     });
    //                 })
    //             );
    //             users.forEach((user) => {
    //                 const count = uniqueAddresses.has(user.address)
    //                     ? uniqueAddresses.size - 1
    //                     : uniqueAddresses.size;
    //                 numberOfHoldersMap[user.address] = count;
    //             });
    //             setNumberOfHolders(numberOfHoldersMap);
    //         } catch (error) {
    //             console.error('Error fetch number of holders', error);
    //         }
    //     }
    //     if (displayContent === 'Top') {
    //         fetchNumberOfHolders();
    //     }
    // }, [displayContent, providerUrl, contractAddress, contractAbi, users]);

    async function fetchMoreTradeEvents() {
        setLoadMoreLoading(true);
        try {
            const lastBlockNumber = tradeEvents[tradeEvents.length - 1].blockNumber;
            const startBlock = Math.max(0, lastBlockNumber - 200000);
            const endBlock = lastBlockNumber - 1;
            const provider = new ethers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            const filter = contract.filters.Trade(null, null, null, null, null, null, null, null, null, null);
            const moreEvents = await contract.queryFilter(filter, startBlock, endBlock);
            setTradeEvents(prevEvents => [...prevEvents, ...moreEvents]);
        } catch (error) {
            console.error('Error fetching more trade events:', error);
        }
        setLoadMoreLoading(false);
    }

    function refreshPage() {
        window.location.reload();
    }

    function convertWeiToEther(weiAmount) {
        if (weiAmount === 0n) {
            return "0";
        } else {
            const etherValue = parseFloat(weiAmount) / 1e18;
            return etherValue.toFixed(5);
        }
    }

    async function fetchGlobalActivity() {
        try {
            const provider = new ethers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            const blockNumber = await provider.getBlockNumber();
            const filter = contract.filters.Trade(null, null, null, null, null, null, null, null, null);
            const events = await contract.queryFilter(filter, blockNumber - 90000, blockNumber);
            setTradeEvents(events);
            setLoading(false);
            setDisplayReloadButton(false);
        } catch (error) {
            console.error('Error fetch events', error);
            setLoading(false);
            setDisplayReloadButton(true);
        }
    }

    async function fetchTop50() {
        try {
            setUserLoading(true);
            const usersRef = ref(db, 'users');
            const snapshot = await get(usersRef);
            const usersData = snapshot.val();
            const provider = new ethers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            if (usersData) {
                const userList = Object.values(usersData);
                const buyPrices = {};
                await Promise.all(
                    userList.map(async (user) => {
                        const buyPriceAfterFeeWei = await contract.getBuyPriceAfterFee(user.address, 1);
                        const buyPriceAfterFeeString = buyPriceAfterFeeWei.toString();
                        const buyPriceAfterFeeEtherDivided = parseFloat(buyPriceAfterFeeString) / 1e18; // 1e18 Wei in 1 Ether
                        const buyPriceAfterFeeFormatted = buyPriceAfterFeeEtherDivided.toFixed(5);
                        buyPrices[user.address] = buyPriceAfterFeeFormatted;
                    })
                );
                const sortedUsers = userList.sort((user1, user2) => {
                    const price1 = parseFloat(buyPrices[user1.address] || 0);
                    const price2 = parseFloat(buyPrices[user2.address] || 0);
                    return price2 - price1;
                });
                const top50Users = sortedUsers.slice(0, 50);
                setUsers(top50Users);
                setUserBuyPrices(buyPrices);
                setUserLoading(false);
            }
        } catch (error) {
            console.error('Error fetch users', error);
            setUserLoading(false);
        }
    }

    function refreshGlobalActivity() {
        fetchGlobalActivity();
    }

    function refreshTop() {
        fetchTop50();
    }

    const setDisplayGlobal = () => {
        setDisplayContent('Global');
    }

    const setDisplayTop = () => {
        setDisplayContent('Top');
    }

    // const setDisplayTrending = () => {
    //     setDisplayContent('Trending');
    // }

    return (
        <div>
            <Navbar />
            <div className="justify-center mx-auto items-center flex max-w-xl pt-14">
                {displayContent === 'Top' && (
                    <div>
                        <span className="mx-4 pt-1 py-1.5 font-semibold text-md" onClick={setDisplayTop}>Leaderboard 🔥</span>
                        <div className='pt-2'></div>
                    </div>
                )}
                <div className="ml-auto">
                    <button onClick={refreshPage} className="mx-4">
                        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                            <path fill="none" stroke="#fff" d="M25.7 10.9C23.9 7.4 20.2 5 16 5c-4.7 0-8.6 2.9-10.2 7m.4 9c1.8 3.5 5.5 6 9.8 6 4.7 0 8.6-2.9 10.2-7" />
                            <path fill="none" stroke="#fff" d="M26 5v6h-6M6 27v-6h6" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="max-w-xl mx-auto">
                {displayContent === 'Top' && (
                    <div>
                        <ul>
                            {users.map((user, index) => (
                                <li key={index}>
                                    <div className='pt-2'></div>
                                    <a href={`/app/user/${user.address}`} className="block">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-white font-semibold text-sm px-4 w-5">
                                                    #{index + 1}
                                                </span>
                                                <img
                                                    src={usernames[user.address]?.pfpUrl || '/default-pfp.png'}
                                                    className="w-10 h-10 rounded-full mx-5 "
                                                />
                                                <div className='font-semibold text-sm'>
                                                    {usernames[user.address]?.displayUsername || 'Unknown User'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="text-white font-medium text-xs text-left">
                                                        <div className="flex items-center px-2 mx-3">
                                                            <span className='px-5'></span>
                                                            <img src="/eth.png" alt="" className="h-4 w-4 -mb-0.5 mr-1" />
                                                            <span className="text-white font-medium text-xs text-left">{userBuyPrices[user.address] || 'Loading...'}</span>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {displayContent === 'Top' && users.length === 0 && (
                <div className="flex items-center justify-center">
                    <div className="pt-60">
                        <button onClick={refreshTop} className="rounded-xl border border-sec bg-sec/20 px-2 py-1 font-semibold text-white hover:bg-sec hover:text-black">
                            Reload
                        </button>
                    </div>
                </div>
            )}
            <div className='pt-32'></div>
            <BottomBar />
        </div>
    );
};

export default Explore;
