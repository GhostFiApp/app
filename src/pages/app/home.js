import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import BottomBar from '@/components/bottombar';
import { useAccount } from 'wagmi';
import ABI from '@/utils/ABI.json';
import { ethers } from 'ethers';
import { ref, get } from 'firebase/database';
import { db } from '../../../firebase';
import { ProviderURL, ContractAddress } from '../../constants'


const Home = () => {
    const { address } = useAccount();
    const contractAddress = ContractAddress;
    const contractAbi = ABI;
    const providerUrl = ProviderURL;
    const [subjects, setSubjects] = useState([]);
    const [holders, setHolders] = useState([]);
    const [holderData, setHolderData] = useState({});
    const [userPrices, setUserPrices] = useState({});
    const [usernames, setUsernames] = useState({});
    const [displayContent, setDisplayContent] = useState('uniqueSubjects');

    useEffect(() => {
        async function fetchSubjects() {
            const provider = new ethers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            const subjectsForBuyer = await contract.getSubjectsForBuyer(address);
            setSubjects(subjectsForBuyer);
        }
        fetchSubjects();
    }, [address]);

    useEffect(() => {
        async function fetchHolders() {
            const provider = new ethers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            const holdersData = await contract.getBuyersForSubject(address);
            setHolders(holdersData);
        }
        fetchHolders();
    }, [address]);

    useEffect(() => {
        async function fetchUsernames() {
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
        }
        fetchUsernames();
    }, []);
    useEffect(() => {
        async function fetchHolderData() {
            const usersRef = ref(db, 'users');
            const snapshot = await get(usersRef);
            const holderDataSnapshot = snapshot.val();

            if (holderDataSnapshot) {
                const holderData = Object.values(holderDataSnapshot).reduce(
                    (acc, user) => ({ ...acc, [user.address]: user }),
                    {}
                );
                setHolderData(holderData);
            }
            console.log(holderData)
        }
        fetchHolderData();
    }, []);

    const uniqueSubjects = subjects.reduce((unique, subject) => {
        if (!unique.find(item => item.address === subject)) {
            unique.push({ address: subject, totalAmount: 1 });
        } else {
            unique.find(item => item.address === subject).totalAmount++;
        }
        return unique;
    }, []);

    const uniqueHolders = holders.reduce((unique, holder) => {
        if (!unique.find(item => item.address === holder)) {
            unique.push({ address: holder, totalAmount: 1 });
        } else {
            unique.find(item => item.address === holder).totalAmount++;
        }
        return unique;
    }, []);

    useEffect(() => {
        async function fetchUserPrices() {
            const provider = new ethers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            const userPricesData = {};
            await Promise.all(
                uniqueSubjects.map(async (subject) => {
                    const amount = subject.totalAmount;
                    const buyPriceAfterFeeWei = await contract.getBuyPriceAfterFee(subject.address, 1);
                    const buyPriceAfterFeeString = buyPriceAfterFeeWei.toString();
                    const buyPriceAfterFeeEtherDivided = parseFloat(buyPriceAfterFeeString) / 1000000000000000000;
                    const buyPriceAfterFeeFormatted = parseFloat(buyPriceAfterFeeEtherDivided).toFixed(5);
                    userPricesData[subject.address] = buyPriceAfterFeeFormatted;
                })
            );
            setUserPrices(userPricesData);
        }
        fetchUserPrices();
    }, [uniqueSubjects]);

    function refreshPage() {
        window.location.reload();
    }

    const setDisplaySubjects = () => {
        setDisplayContent('uniqueSubjects');
    }

    const setDisplayHolders = () => {
        setDisplayContent('uniqueHolders');
    }

    return (
        <div>
            <Navbar />
            <div className="justify-center mx-auto items-center flex max-w-xl pt-14">
                {displayContent === 'uniqueSubjects' && (
                    <div>
                        <span className="mx-4 pt-1  py-1.5 text-md font-semibold" onClick={setDisplaySubjects}>Your <span className='text-sec font-semibold'>$GHOST</span></span>
                        <span className="pt-1 py-1.5 font-extralight text-md hover:font-bold" onClick={setDisplayHolders}>Your Holders</span>
                    </div>
                )}
                {displayContent === 'uniqueHolders' && (
                    <div>
                        <span className="mx-4 pt-1  py-1.5 font-extralight text-md hover:font-bold" onClick={setDisplaySubjects}>Your <span className='text-sec font-semibold'>$GHOST</span></span>
                        <span className="pt-1 py-1.5 text-md font-semibold" onClick={setDisplayHolders}>Your Holders</span>
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
                {displayContent === 'uniqueSubjects' && uniqueSubjects.length > 0 && (
                    <div>
                        <ul>
                            {uniqueSubjects.map((subject, index) => (
                                <li key={index}>
                                    <div className='pb-1'></div>
                                    <a href={`/app/user/${subject.address}`} className="block">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <img
                                                    src={usernames[subject.address]?.pfpUrl || '/default-pfp.png'}
                                                    className="w-10 h-10 rounded-full mx-2"
                                                />
                                                <div className='font-semibold text-sm'>
                                                    {usernames[subject.address]?.displayUsername || 'Unknown User'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="text-white font-medium text-xs text-left">
                                                        <div className="flex items-center px-2">
                                                            <img src="/eth.png" alt="" className="h-4 w-4 -mb-0.5 mr-1" />
                                                            <span className="text-white font-medium text-xs text-left">{userPrices[subject.address]}</span>
                                                        </div>
                                                    </span>
                                                    <span className="text-white font-medium text-xs text-left">
                                                        <div className="flex items-center px-3">
                                                            <span className="text-white font-medium text-xs text-left">You own: {subject.totalAmount}</span>
                                                            <img src="/ghost.png" alt="" className="h-4 w-4 -mb-0.5 ml-1" />
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <div className='pt-2'></div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-center py-4">
                            <a href='/app/explore'>
                                <button className="flex items-center rounded-xl border border-sec bg-sec/20 px-2 py-1 font-light text-white hover:bg-sec hover:text-black">
                                    Get More
                                    <img src="/ghost.png" alt="" className="h-4 w-4 ml-1 -mb-1" />
                                </button>
                            </a>
                        </div>
                        <div className='pt-32'></div>
                    </div>
                )}
                {displayContent === 'uniqueHolders' && uniqueHolders.length > 0 && (
                    <div>
                        <ul>
                            {uniqueHolders.map((holder, index) => (
                                <li key={index}>
                                    <div className='pt-2'></div>
                                    <a href={`/app/user/${holder.address}`} className="block">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <img
                                                    src={usernames[holder.address]?.pfpUrl || '/default-pfp.png'}
                                                    className="w-10 h-10 rounded-full mx-2"
                                                />
                                                <div className='font-semibold text-sm'>
                                                    {usernames[holder.address]?.displayUsername || 'Unknown User'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="text-white font-medium text-xs text-left">
                                                        <div className="flex items-center px-3">
                                                            <span className="text-white font-medium text-xs text-left">{holder.totalAmount}</span>
                                                            <img src="/ghost.png" alt="" className="h-4 w-4 -mb-0.5 ml-1" />
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <div className='pt-2'></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <BottomBar />
        </div>
    );
};

export default Home;
