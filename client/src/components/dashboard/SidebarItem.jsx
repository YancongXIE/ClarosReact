/*
Sidebar items for Dashboard component
by Matthew Campbell
*/

import { Link, useLocation } from "react-router-dom";

export default function SidebarItem({ href, label, isCollapsed, icon }) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <li className={`group`}>
      <Link
        to={href}
        className={`flex items-center py-3 px-4 hover:bg-base-200 transition ${
          isActive ? "bg-base-300" : ""
        }`}
      >
        {icon}
        <span
          className={`text-primary-content ml-4 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}
