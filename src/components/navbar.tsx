import React from "react";
import Link from "next/link";
import Image from "next/image";
import Connector from "@/components/connectorapp"

const Navbar = () => {
  return (
    <div className='z-[1000] fixed top-0 w-full border-b-[1px] border-b-sec bg-black'>
      <div className="w-full pt-1 pb-1">
        <nav className="flex items-center justify-between mx-2.5 pt-0.5">
          <div className="w-64">
            <Link href="/">
              <div className='flex'>
                <Image src='/logo.png' width={150} height={100} alt='GhostFi Logo' />
              </div>
            </Link>
          </div>
          <div className="flex">
            <Connector />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
