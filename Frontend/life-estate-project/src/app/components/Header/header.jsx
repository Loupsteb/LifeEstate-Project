import ConnectionBtn from "../Button/connectionBtn";
import Navbar from "../Navbar/index"; // Assurez-vous que le chemin d'importation est correct

export default function Header() {
  return (
    <header className="text-gray-700 bg-gray-100 shadow-md">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <div className="flex items-center">
          {/* Logo et Titre */}
          <span className="ml-3 text-xl font-bold">Life Estate</span>
        </div>
        <Navbar />
        <div>
          <ConnectionBtn />
        </div>
      </div>
    </header>
  );
}
