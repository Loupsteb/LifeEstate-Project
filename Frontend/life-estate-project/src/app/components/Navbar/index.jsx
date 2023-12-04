import Link from "next/link";

function Navbar() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/mint">Mint Page</Link>
      </li>
      <li>
        <Link href="/admin">Admin Page</Link>
      </li>
      <li>
        <Link href="/marketplace">Market Place</Link>``
      </li>
    </ul>
  );
}

export default Navbar;
