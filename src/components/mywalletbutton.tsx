import { useRouter } from "next/router";

export default function MyWalletButton() {
    const router = useRouter();

    function goMyWallet() {
        router.push('/app/wallet')
    }

    return (
        <div className="text-white pt-4 flex justify-center">
            <button onClick={goMyWallet} className="flex items-center justify-center rounded-xl border border-sec bg-sec/20 w-64 hover:bg-sec hover:text-black px-4 py-1">
                <svg className="mr-2" width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#12fb16">
                    <g />
                    <path d="M19.732 7.203V4.537h-7.464v2.666H3.205v20.259h25.59V7.203h-9.063zm-6.398-1.599h5.331v1.599h-5.331V5.604zM12.268 8.27h15.461v8.53h-7.997v-2.133h-7.464V16.8H4.271V8.27h7.997zm6.398 7.463v3.199h-5.331v-3.199h5.331zM4.271 26.396v-8.53h7.997v2.133h7.464v-2.133h7.997v8.53H4.272z" />
                </svg>
                My Profile
            </button>
        </div>
    );
}
