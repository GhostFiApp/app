import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const NonPWAInstallModal = dynamic(() => import('@/components/nonpwainstallmodal'), { ssr: false });

const MobileInstallModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setPromptInstall(e);
            setShowModal(true);
        };
        const isIPhone = /iPhone/.test(navigator.userAgent);

        if (isIPhone) {
            setShowModal(true);
        } else if (
            'standalone' in window.navigator &&
            !window.navigator.standalone &&
            'onbeforeinstallprompt' in window
        ) {
            window.addEventListener('beforeinstallprompt', handler);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const supportsPWA =
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {!supportsPWA && showModal && (
                <>
                    <NonPWAInstallModal />
                    <button onClick={closeModal} className="flex rounded-lg px-[38px] py-1 border border-sec bg-sec/20 text-sec hover:bg-sec hover:text-black font-semibold">Not now</button>
                </>
            )}
        </>
    )
}

export default MobileInstallModal;
