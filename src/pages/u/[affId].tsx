import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from "next/head";
import { WebsiteSlogan, WebsiteName, WebsiteURL } from "@/constants";

const affId = () => {
    const router = useRouter();

    useEffect(() => {
        const delay = 1000;
        const timeoutId = setTimeout(() => {
            router.push('/');
        }, delay);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [router]);

    return (
        <div>
            <Head>
                <title>{WebsiteName + " | " + WebsiteSlogan}</title>
                <link rel="icon" href="favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon-512x512.png" />
                <meta name="description" content="" />
                <meta name="robots" content="follow, index" />
                <link rel="canonical" href={WebsiteURL} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={WebsiteName + " | " + WebsiteSlogan} />
                <meta property="og:description" content={WebsiteSlogan} />
                <meta property="og:url" content={WebsiteURL} />
                <meta property="og:image" content={`${WebsiteURL}/og.jpg`} />
            </Head>
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rotate-image">
                    <Image src="/ghost.png" alt='logo ghostfi.xyz' width={120} height={120} />
                </div>
            </div>
        </div>
    );
}

export default affId;
