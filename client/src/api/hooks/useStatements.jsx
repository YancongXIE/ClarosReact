import { useState, useEffect } from 'react';
import { kAPI_URL } from '../utils/constants';

export function useStatements() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching statements from statement1 table');
        const response = await fetch(`${kAPI_URL}/api/statement1`);
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Received statements data:', result);
        
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
        console.error('Error fetching statements:', err);
        setError(err.message);
        setData(null); // Ensure data is set to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array since we don't need any dependencies

  return { data, loading, error };
}

