import React, { useState, useContext } from 'react';
import { TwitterAuthContextProvider, TwitterAuthContext } from '@/components/twitterauthcontext';
import { useUser } from '@/utils/usercontext';

const TwitterAuth = () => {
    const context = useContext(TwitterAuthContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { twitterSignIn, user } = context;
    const [id, setId] = useState('');
    const [displayUsername, setDisplayUsername] = useState('');
    const [pfpURL, setPfpURL] = useState('');
    const { setUser } = useUser();

    const handleTwitterSignIn = async () => {
        await twitterSignIn();
        if (user) {
            setId(user.uid);
            setDisplayUsername(user.displayName || '');
            setPfpURL(user.photoURL || '');
            setUser(user);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center bg-black bg-opacity-50">
                <button onClick={handleTwitterSignIn} className='flex border border-sec rounded-lg font-semibold bg-sec/20 text-center px-2.5 hover:text-black hover:bg-sec py-1'>
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#5eead3" className='pt-1 mx-1'><path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" /></svg>
                    Sign in with Twitter
                </button>
            </div>
        </div>
    );
};

const TwitterAuthWithContext = () => {
    return (
        <TwitterAuthContextProvider>
            <TwitterAuth />
        </TwitterAuthContextProvider>
    );
};

export default TwitterAuthWithContext;
