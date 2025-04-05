import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { kAPI_URL } from '../utils/constants';

export function useExerciseStatements() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      // 如果没有 user 或 id，不进行请求
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${kAPI_URL}/api/statements/${user.id}`);
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        // Check if result.data exists and is an array
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid data format received from server');
        }
        
        // Transform the data to match the expected format
        const transformedData = result.data.map(item => ({
          statementID: item.statementID,
          short: item.short,
          statementText: item.statementText
        }));
        
        setData(transformedData);
      } catch (err) {
        setError(err.message);
        setData(null); // Ensure data is set to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return { data, loading, error };
}

