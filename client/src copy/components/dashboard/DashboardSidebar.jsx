/*
Sidebar for Dashboard component
by Matthew Campbell
*/

import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import SidebarItem from "./SidebarItem";
import Icons from "./DashboardIcons";

export default function DashboardSidebar({ isCollapsed }) {
  const { darkMode } = useContext(ThemeContext);

  const sidebarItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Icons.Home /> },
    { href: "/dataanalyst", label: "Data Analyst", icon: <Icons.DataStack /> },
    { href: "/guide", label: "Guide", icon: <Icons.InfoIcon /> },
    { href: "/settings", label: "Settings", icon: <Icons.SettingsCog /> },
  ];
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
          {isCollapsed ? "L" : "Localis"}
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
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
