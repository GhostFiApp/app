import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { ref, onValue } from 'firebase/database';
import { db } from '../../../firebase';

interface User {
    address: string;
}

const Dispatch = () => {
    const router = useRouter();
    const { address } = useAccount();
    useEffect(() => {
        async function checkAddress() {
            if (!address) {
                router.push('/');
            } else {
                const usersRef = ref(db, 'users');
                onValue(
                    usersRef,
                    (snapshot) => {
                        const usersData = snapshot.val();
                        if (usersData) {
                            const addresses = (Object.values(usersData) as User[]).map((user: User) => user.address);
                            if (addresses.includes(address)) {
                                router.push('/app/home');
                            } else {
                                router.push('/app/onboard');
                            }
                        } else {
                            router.push('/app/onboard');
                        }
                    },
                    (error) => {
                        console.error('Database error =>', error);
                        router.push('/');
                    }
                );
            }
        }
        checkAddress();
    }, [address]);
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rotate-image">
                <Image src="/ghost.png" alt='logo ghostfi.xyz' width={120} height={120} />
            </div>
        </div>
    );
};

export default Dispatch;
