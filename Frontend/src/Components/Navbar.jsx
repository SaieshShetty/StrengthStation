import React from "react";
import { BicepsFlexed, Palette } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = () => {
    if (authUser) {
      navigate("/user");
    } else {
      navigate("/");
    }
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
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>

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
                aria-label="Business"
                value="business"
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
                aria-label="Synthwave"
                value="synthwave"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Wireframe"
                value="wireframe"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
