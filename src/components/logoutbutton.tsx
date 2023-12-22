import { useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LogOutButton() {
    const { disconnect } = useDisconnect();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        disconnect();
        router.push('/');
    };

    useEffect(() => {
        if (loggingOut) {
            handleLogout();
        }
    }, [loggingOut]);

    return (
        <div className="text-white pt-4 flex justify-center">
            <button onClick={handleLogout} className="flex items-center justify-center rounded-xl border border-sec bg-sec/20 w-64 hover:bg-sec hover:text-white px-4 py-1">
                <svg width="18" height="18" className="mr-2" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M1 1h7v1H2v11h6v1H1V1Zm9.854 3.146 3.34 3.34-3.327 3.603-.734-.678L12.358 8H4V7h8.293l-2.147-2.146.708-.708Z" fill="#12fb16" /></svg>
                Log Out
            </button>
        </div>
    );
}