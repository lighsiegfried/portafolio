import { useState, useEffect, useCallback } from 'react';

export function useApiResource(fetchFn, initialParams) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const load = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn(p);
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    load(params);
  }, [load, params]);

  const refetch = useCallback((newParams) => {
    setParams(newParams || params);
  }, [params]);

  return { data, loading, error, refetch };
}
