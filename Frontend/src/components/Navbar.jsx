import { useState } from "react";
import { Sun, Moon, UserCircle } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/Placeholder";
import { Link } from "react-router-dom";
export default function Navbar() {
const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-violet-600  text-white px-6 py-3 flex items-center justify-between">
      <div className="text-xl font-bold">
        <Link to="/">TARKVITARK</Link>
      </div>

      <PlaceholdersAndVanishInput 
        placeholders={["Search for debates...", "Search by topics...", "Search by users..."]}
        onChange={(e) => console.log(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Search submitted");
        }}
      />

      <div className="flex items-center space-x-4">
        <button className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
          Change Language
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-blue-600 p-2 rounded-full"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Link to="/profile">

        <UserCircle size={28} className="text-white cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
}
