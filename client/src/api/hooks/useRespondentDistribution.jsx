import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { kAPI_URL } from '../utils/constants';

export function useRespondentDistribution() {
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDistribution = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${kAPI_URL}/api/respondent/${user.id}/distribution`);
        const data = await response.json();
        
        if (data.Error) {
          setError(data.Message);
          setDistribution(null);
        } else {
          setDistribution(data.data);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
        setDistribution(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, [user?.id]);

  return { distribution, loading, error };
} 