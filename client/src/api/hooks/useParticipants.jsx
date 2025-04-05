import { useState, useEffect } from "react";
import { kAPI_URL } from '../utils/constants';

export function useParticipants() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${kAPI_URL}/api/participants`);
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.data); // Assuming the data is inside result.data
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  return { data, loading, error };
}