import { useState, useEffect } from "react";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardNav from "../dashboard/DashboardNav";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // Check screen width on component mount and resize
  useEffect(() => {
    const handleResize = () => {
      // Set sidebar collapsed if screen width is less than 1222px
      if (window.innerWidth < 1222) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Add event listener on component mount
    window.addEventListener("resize", handleResize);

    // Initial check on component mount
    handleResize();

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      <DashboardSidebar isCollapsed={isCollapsed} />
      <div className="flex flex-col flex-1">
        <DashboardNav toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-auto p-4 bg-base-200">{children}</div>
      </div>
    </div>
  );
}

//src: https://dev.to/chintanonweb/from-zero-to-hero-building-a-scalable-react-admin-dashboard-layout-53p9
