// hook for fetching user data

import { useState, useEffect } from "react";
import { getUrlFromCache, getUrlFromServer } from "../utils/utils";
import { kAPI_URL } from '../utils/constants';

export function useFetchUserData(endpoint) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let url = `${kAPI_URL}${endpoint}`;
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const cachedData = getUrlFromCache(cache, url);

      if (cachedData) {
        setLoading(false);
        setData(cachedData);
        setError(null);
      } else {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token in Authorization header
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const dataSet = await response.json();
          setCache((prevCache) => ({ ...prevCache, [url]: dataSet }));
          setData(dataSet);
          setError(null);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [endpoint, cache]);

  return {
    loading,
    data,
    error,
  };
}