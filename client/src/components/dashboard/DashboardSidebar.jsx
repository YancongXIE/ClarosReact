/*
Sidebar for Dashboard component
by Matthew Campbell
*/

import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import { AuthContext } from "../../context/AuthProvider";
import SidebarItem from "./SidebarItem";
import Icons from "./DashboardIcons";
import { useLocation } from "react-router-dom";

export default function DashboardSidebar({ isCollapsed }) {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const adminItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/project-management", label: "Project Management", icon: <Icons.Folder /> },
    { href: "/dataanalyst", label: "Ranking Application", icon: <Icons.CPUChip/> },
    { href: "/guide", label: "Guide", icon: <Icons.InfoIcon /> },
    { href: "/settings", label: "Settings", icon: <Icons.SettingsCog /> },
  ];

  const managerItems = [
    ...adminItems,
    { href: "/usermanagement", label: "User Management", icon: <Icons.User /> },
  ];

  const adminMenuItems = adminItems;

  const respondentItems = [
    { href: "/ranking-exercise", label: "Ranking Exercise", icon: <Icons.CPUChip/> },
    { href: "/guide", label: "Guide", icon: <Icons.InfoIcon /> },
  ];

  const sidebarItems = user?.role === "manager" 
    ? managerItems 
    : user?.role === "admin"
    ? adminMenuItems
    : respondentItems;

  return (
    <aside
      className={`${
        isCollapsed ? "w-14" : "w-64"
      } h-full bg-base-300 transition-all duration-300 border-e-2 border-base-200`}
    >
      <div className="p-5">
        <div
          className={`text-xl font-bold relative -top-1 ${
            darkMode ? "text-primary-content" : "text-primary"
          }`}
        >
          {isCollapsed ? "C" : "Claros"}
        </div>
      </div>

      <nav className="mt-4" aria-label="Main Navigation">
        <ul>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              isCollapsed={isCollapsed}
              icon={item.icon}
              active={location.pathname === item.href}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
