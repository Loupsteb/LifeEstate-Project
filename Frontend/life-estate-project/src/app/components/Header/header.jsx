import ConnectionBtn from "../Button/connectionBtn";
import Navbar from "../Navbar/index";


export default function Header() {
  return (
    <header className="text-gray-700 bg-gray-100 shadow-md">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <div className="flex items-center">
          <span className="ml-3 text-xl font-bold">Life Estate</span>
        </div>
        <Navbar />
      </div>
    </header>
  );
}
