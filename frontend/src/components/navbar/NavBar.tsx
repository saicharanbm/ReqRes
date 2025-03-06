import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <nav className="h-16 fixed top-0 w-full text-white flex items-center justify-between px-[6%] shadow-xl dark:border-b-2 bg-[#FBFBFB] dark:bg-[#09090B] border-[#262d38] z-40">
      <div className="flex space-x-12">
        <div className="icon">
          <h1
            className="text-3xl font-bold tracking-wider text-[#121212] dark:text-[#fff] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span>Req</span>
            <span className="text-blue-700">Res</span>
          </h1>
        </div>
      </div>
      <button
        onClick={toggleDarkMode}
        className="relative px-2 py-1 rounded-full overflow-hidden transition-all duration-300 group flex items-center justify-between gap-2 border border-gray-300 dark:border-gray-700 text-sm font-medium"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span
          className="absolute inset-0 w-1/2 bg-yellow-500/25 dark:bg-blue-500/25 transition-transform duration-300 transform ease-in-out rounded-full group-hover:bg-yellow-500/20 dark:group-hover:bg-blue-500/20"
          style={{
            transform: darkMode ? "translateX(0%)" : "translateX(100%)",
          }}
        ></span>
        <div
          className={`relative z-10 flex items-center justify-center p-1 pr-3 rounded-full ${
            darkMode ? "text-blue-600 font-medium" : "text-gray-500"
          }`}
        >
          <Moon
            size={16}
            className={`${darkMode ? "opacity-100" : "opacity-50"}`}
          />
        </div>
        <div
          className={`relative z-10 flex items-center justify-center p-1 rounded-full ${
            !darkMode ? "text-yellow-500 font-medium" : "text-gray-500"
          }`}
        >
          <Sun
            size={16}
            className={`${!darkMode ? "opacity-100" : "opacity-50"}`}
          />
        </div>
      </button>
    </nav>
  );
};

export default Navbar;
