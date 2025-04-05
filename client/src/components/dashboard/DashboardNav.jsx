/*
Navbar for Dashboard component
by Matthew Campbell
*/

import { useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";
import DarkmodeToggler from "../ui/DarkModeToggler";
import Icons from "./DashboardIcons";
import { AuthContext } from "../../context/AuthProvider";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function DashboardNav({ toggleSidebar }) {
  const { handleLogout, loading } = useContext(AuthContext);

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownIsOpen(!dropdownIsOpen);

  useClickOutside(dropdownRef, () => setDropdownIsOpen(false), dropdownIsOpen);

  const handleSettingsClick = () => {
    setDropdownIsOpen(false);
  };

  return (
    <header className="w-full bg-base-300 p-4 top-0 border-b-2 border-base-200 z-50">
      <nav className="flex justify-between items-center ">
        <div>
          <button onClick={toggleSidebar}>
            <Icons.Hamburger />
          </button>
        </div>
        <div className="flex items-center space-x-6">
          <DarkmodeToggler />
          <button onClick={toggleDropdown}>
            <Icons.User />
          </button>
          {dropdownIsOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-2 top-14 mt-4 w-32 bg-base-300 shadow-md rounded-md z-10"
            >
              <ul className="py-2">
                <li>
                  <Link
                    to="/settings"
                    onClick={handleSettingsClick}
                    className="px-4 py-2 hover:bg-base-200 text-primary-content cursor-pointer"
                  >
                    Settings
                  </Link>
                </li>
                <li
                  className="px-4 py-2 hover:bg-base-200 font-bold  text-primary cursor-pointer"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : "Logout"}
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
