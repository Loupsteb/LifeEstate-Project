import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { adminAdd } from "../../../../constant/adminAddress";
function Navbar() {
  const { address, isConnected } = useAccount();
  const isAdmin = address === adminAdd;

  return (
    <ul className="flex justify-between w-full mx-2 my-4">
      {isConnected && (
        <>
          <li>
            <Link href="/" passHref>
              <button className="px-4 py-2 text-black bg-white border border-gray-300 rounded hover:bg-gray-100">
                Home
              </button>
            </Link>
          </li>
          <li>
            <Link href="/mint" passHref>
              <button className="px-4 py-2 text-black bg-white border border-gray-300 rounded hover:bg-gray-100">
                Mint Page
              </button>
            </Link>
          </li>
          <li>
            <Link href="/marketplace" passHref>
              <button className="px-4 py-2 text-black bg-white border border-gray-300 rounded hover:bg-gray-100">
                Market Place
              </button>
            </Link>
          </li>
        </>
      )}
      <li>
        {isAdmin && (
          <Link href="/admin" passHref>
            <button className="px-4 py-2 text-black bg-white border border-gray-300 rounded hover:bg-gray-100">
              Admin Page
            </button>
          </Link>
        )}
      </li>
      <li>
        <ConnectButton />
      </li>
    </ul>
  );
}

export default Navbar;
