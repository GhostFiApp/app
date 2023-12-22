import Head from "next/head";
import { WebsiteSlogan, WebsiteName, WebsiteURL } from "@/constants";
import Navbar from "@/components/navbarhome";
import Welcome from "@/components/welcome";
import Particles from '../utils/particles';

export default function Home() {
  return (
    <>
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
      <div className="absolute inset-0 max-w-full mx-auto top-0 z-0 pointer-events-none">
        <Particles
          className="absolute top-10 bottom-10 inset-0 z-0 pointer-events-none h-[800px] sm:h-[900px]"
          quantity={50}
        />
      </div>
      <Navbar />
      <Welcome />
    </>
  );
}
