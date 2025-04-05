/*
Context provider for theme switching
by Matthew Campbell
*/

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { AuthContext } from "./AuthProvider";
import { useLocation } from "react-router-dom";
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const location = useLocation();
  const { user, isLoggedIn, isAuthChecked } = useContext(AuthContext);

  // State for dark mode
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const theme = useMemo(() => {
    if (location.pathname === "/") {
      return "publicTheme";
    }

    if (!isAuthChecked) {
      return "publicTheme";
    }

    if (!isLoggedIn || !user?.lga) {
      return darkMode ? "darkTheme" : "publicTheme";
    }

    const lga = user.lga.toLowerCase().replace(/\s+/g, "");
    switch (lga) {
      case "noosa":
        return darkMode ? "noosaDarkTheme" : "noosaTheme";
      case "goldcoast":
        return darkMode ? "goldCoastDarkTheme" : "goldCoastTheme";
      case "whitsunday":
        return darkMode ? "whitsundayDarkTheme" : "whitsundayTheme";
      case "cairns":
        return darkMode ? "cairnsDarkTheme" : "cairnsTheme";
      default:
        return darkMode ? "darkTheme" : "publicTheme";
    }
  }, [darkMode, user?.lga, isLoggedIn, isAuthChecked, location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ theme, darkMode, toggleDarkMode }),
    [theme, darkMode, toggleDarkMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
