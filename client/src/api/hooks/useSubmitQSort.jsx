import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { kAPI_URL } from '../utils/constants';

export function useSubmitQSort() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const submitQSort = async (selectedValues) => {
    if (!user?.id) {
      setError('用户未登录');
      return false;
    }

    setLoading(true);
    setError(null);
    
    console.log('user.adminID:', user.adminID);

    try {
      // 准备要提交的数据
      const qSortData = Object.entries(selectedValues).map(([statementID, qSortValue]) => ({
        respondentID: user.id,
        statementID: parseInt(statementID),
        qSortValue: qSortValue,
        adminID: user.adminID
      }));

      console.log("Sending qSort data:", qSortData);

      const response = await fetch(`${kAPI_URL}/api/qsort`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qSortData)
      });

      if (!response.ok) {
        throw new Error(`提交失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.Error) {
        throw new Error(result.Message);
      }
      return true;
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitQSort, loading, error };
} 