/*
Context provider for authentication
by Matthew Campbell
*/

import { createContext, useState, useEffect } from "react";
import { kAPI_URL } from '../api/utils/constants';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const cachedUser = localStorage.getItem("userData");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setIsLoggedIn(true);
        setIsAuthChecked(true);
        return;
      }

      try {
        const res = await fetch(`${kAPI_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();

        console.log('data', data);

        const transformedUserData = data.user.role === 'respondent' 
          ? {
              id: data.user.id,
              username: data.user.username,
              role: data.user.role,
              studyId: data.user.studyId,
              adminID: data.user.adminID
            }
          : {
              email: data.user.email,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              role: data.user.role,
              adminID: data.user.adminID
            };

        setUser(transformedUserData);
        localStorage.setItem("userData", JSON.stringify(transformedUserData));
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Couldn't fetch user data", err);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      } finally {
        setIsAuthChecked(true);
      }
    } else {
      setIsAuthChecked(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      setUser(null);
      setShowLogoutToast(true);
      setTimeout(() => {
        setShowLogoutToast(false);
      }, 3000);
    }, 1500);
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${kAPI_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
      });
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        handleLogout,
        showLogoutToast,
        loading,
        user,
        isAuthChecked,
        fetchUserData,
      }}
    >
      {isAuthChecked ? children : null}
    </AuthContext.Provider>
  );
}
