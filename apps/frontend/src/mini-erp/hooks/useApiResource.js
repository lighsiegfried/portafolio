import { useState, useEffect, useCallback } from 'react';

/**
 * Generic fetch-on-mount resource hook.
 *
 * `error` is `null` or `{ message }`, where `message` is the raw API text and may
 * be an empty string. The localized fallback is deliberately NOT resolved here:
 * keeping the dictionary out of `load`'s dependencies is what stops a language
 * toggle from triggering a refetch. Callers render
 * `error.message || te.errors.<something>`.
 *
 * @param {(params?: any) => Promise<{ data: any }>} fetchFn
 * @param {any} [initialParams]
 * @returns {{ data: any, loading: boolean, error: { message: string } | null, refetch: (p?: any) => void }}
 */
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
      setError({ message: err.message || '' });
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
