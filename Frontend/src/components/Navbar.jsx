// import { useState } from "react";
// import { Sun, Moon, UserCircle } from "lucide-react";
// import { PlaceholdersAndVanishInput } from "../ui/Placeholder";
// import { Link } from "react-router-dom";
// export default function Navbar() {
// const [darkMode, setDarkMode] = useState(false);

//   return (
//     <nav className="bg-gradient-to-r from-blue-600 to-violet-600  text-white px-6 py-3 flex items-center justify-between">
//       <div className="text-xl font-bold">
//         <Link to="/">TARKVITARK</Link>
//       </div>

//       <PlaceholdersAndVanishInput 
//         placeholders={["Search for debates...", "Search by topics...", "Search by users..."]}
//         onChange={(e) => console.log(e.target.value)}
//         onSubmit={(e) => {
//           e.preventDefault();
//           console.log("Search submitted");
//         }}
//       />

//       <div className="flex items-center space-x-4">
//         <button className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
//           Change Language
//         </button>

//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className="bg-white text-blue-600 p-2 rounded-full"
//         >
//           {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//         </button>
//         <Link to="/profile">

//         <UserCircle size={28} className="text-white cursor-pointer" />
//         </Link>
//       </div>
//     </nav>
//   );
// }


// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { UserCircle, ChevronDown } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/Placeholder";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { language, setLanguage, languages, isTranslating } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = languages.find((lang) => lang.code === language) || {
    code: "en",
    name: "English",
    flag: "🌐",
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 flex items-center justify-between">
      <div className="text-xl font-bold">
        <Link to="/" >
          TARKVITARK
        </Link>
      </div>

      <div className="w-1/3" >
        <PlaceholdersAndVanishInput
          placeholders={[
            "Search for debates...",
            "Search by topics...",
            "Search by users...",
          ]}
          onChange={(e) => console.log(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Search submitted");
          }}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={isTranslating}
            className={`flex items-center space-x-2 bg-white text-blue-600 px-3 py-1 rounded-md font-medium min-w-[120px] justify-center ${
              isTranslating ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isTranslating ? (
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <div className="flex items-center">
                <span className="text-lg mr-2">{currentLanguage.flag}</span>
                <span className="truncate">{currentLanguage.name}</span>
                <ChevronDown size={16} className="ml-1" />
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 max-h-60 overflow-y-auto">
              <div className="px-4 py-2 text-gray-500 text-sm">
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-800 hover:bg-blue-100 transition ${
                    language === lang.code ? "bg-blue-50 font-medium" : ""
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/profile" aria-label="Go to profile">
          <UserCircle size={28} className="text-white" />
        </Link>
      </div>
    </nav>
  );
}