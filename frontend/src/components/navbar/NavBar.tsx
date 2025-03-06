import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import UserModal from "./UserModal";

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
    <nav className="h-16  fixed top-0 w-full text-white flex items-center justify-between px-[6%]  shadow-xl dark:border-b-2 bg-[#FBFBFB]  dark:bg-[#09090B] border-[#262d38] z-40">
      <div className="flex space-x-12">
        <div className="icon">
          <h1
            className="text-3xl font-bold tracking-wider text-[#121212] dark:text-[#fff] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span>Req</span>
            <span className=" text-blue-700 ">Res</span>
          </h1>
        </div>
      </div>
      <button
        onClick={toggleDarkMode}
        className="p-2 bg-gray-200 dark:bg-gray-800 rounded"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
