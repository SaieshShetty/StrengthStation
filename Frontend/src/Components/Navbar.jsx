import React, { useState } from "react";
import { BicepsFlexed, Palette, ChevronDown, UserPlus, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

  const handleClick = () => {
    if (authUser) {
      navigate("/user");
    } else {
      navigate("/");
    }
  };

  const toggleAuthDropdown = () => {
    setIsAuthDropdownOpen(!isAuthDropdownOpen);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 flex justify-between items-center z-10">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold flex items-center">
          <BicepsFlexed className="w-6 h-6" />
        </span>
        <button onClick={handleClick}>
          <span className="btn btn-ghost text-xl">StrengthStation</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Auth Dropdown - Replacing the search input */}
        {!authUser && (
          <div className="relative">
            <button 
              onClick={toggleAuthDropdown}
              className="flex items-center gap-2 px-4 py-2 bg-transparent text-primary-content rounded-3xl shadow-md hover:bg-primary-focus transition-all duration-300"
            >
              <span className="font-medium">Account</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform duration-300 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isAuthDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-xl overflow-hidden origin-top-right">
                <div className="py-1">
                  <Link 
                    to="/signup" 
                    className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 transition-colors duration-200"
                  >
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </Link>
                  <div className="border-t border-base-300"></div>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 transition-colors duration-200"
                  >
                    <LogIn size={18} />
                    <span>Log In</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {authUser && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={authUser?.profilePic || "avatar.png"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile">
                  <button>Profile</button>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <Link to="/logout">
                  <button>Logout</button>
                </Link>
              </li>
            </ul>
          </div>
        )}

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1 rounded-full">
            <Palette />
            <svg
              width="12px"
              height="12px"
              className="ml-2 h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Lemonade"
                value="lemonade"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Retro"
                value="retro"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Cyberpunk"
                value="cyberpunk"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dracula"
                value="dracula"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Pastel"
                value="pastel"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;