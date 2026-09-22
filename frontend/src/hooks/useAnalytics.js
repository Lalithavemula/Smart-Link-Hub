import { useState, useCallback } from 'react';
import { analyticsApi } from '../api/analytics';

export const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (params) => {
    setLoading(true);
    try {
      const responseData = await analyticsApi.getAnalytics(params);
      setData(responseData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAnalytics };
};
