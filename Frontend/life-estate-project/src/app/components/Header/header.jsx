"use client";

import ConnectionBtn from "../Button/connectionBtn";

export default function Header() {
  return (
    <header className="text-gray-700 bg-gray-100 shadow-md">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <div className="flex items-center">
          {/* <Image
            src="/voting-logo-dapp.svg"
            alt="Logo"
            width={50}
            height={50}
          /> */}
          <span className="ml-3 text-xl font-bold">Life Estate</span>
        </div>
        <div>
          <ConnectionBtn />
        </div>
      </div>
    </header>
  );
}
