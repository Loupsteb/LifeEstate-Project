import Link from "next/link";

function Navbar() {
  return (
    <ul className="flex justify-between w-full">
      <li>
        <Link href="/" passHref>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">
            Home
          </button>
        </Link>
      </li>
      <li>
        <Link href="/mint" passHref>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">
            Mint Page
          </button>
        </Link>
      </li>
      <li>
        <Link href="/admin" passHref>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">
            Admin Page
          </button>
        </Link>
      </li>
      <li>
        <Link href="/marketplace" passHref>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">
            Market Place
          </button>
        </Link>
      </li>
    </ul>
  );
}

export default Navbar;
