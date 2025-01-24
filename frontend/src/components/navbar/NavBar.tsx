import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
// import UserModal from "./UserModal";

type NavbarProps = {
  userData?: { avatarUrl: string; fullName: string };
};

const Navbar = ({ userData }: NavbarProps) => {
  const defaultAvatar = useRef(
    "https://m.media-amazon.com/images/G/02/CerberusPrimeVideo-FN38FSBD/adult-2.png"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timer
    }
    setIsDropdownOpen(true); // Open dropdown
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false); // Close dropdown after delay
    }, 300); // Adjust the delay time as needed
  };

  // Close dropdown when userData changes (e.g., user logs out)
  useEffect(() => {
    if (!userData) {
      setIsDropdownOpen(false);
    }
  }, [userData]);

  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Clean up timeoutRef on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
            <span>Ping</span>
            <span className=" text-blue-700 ">Man</span>
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      {userData ? (
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`rounded-full p-1 cursor-pointer ${
              isDropdownOpen && "bg-white"
            } transform duration-200 ease-in-out`}
          >
            <img
              src={userData?.avatarUrl || defaultAvatar.current}
              alt="profile picture"
              className="w-10 h-10 rounded-full"
            />
          </div>
          {/* {isDropdownOpen && <UserModal fullName={userData.fullName} />} */}
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          {["/login", "/signup"].map((authPath, index) => (
            <NavLink
              key={index}
              to={authPath}
              className={({ isActive }) =>
                `text-lg p-1 rounded cursor-pointer  hover:bg-blue-700 font-semibold hover:opacity-100   ${
                  isActive
                    ? "bg-blue-700  text-[#fff] opacity-80 "
                    : "text-[#121212] dark:text-[#fff]"
                }`
              }
            >
              {authPath === "/login" ? "Login" : "Signup"}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
