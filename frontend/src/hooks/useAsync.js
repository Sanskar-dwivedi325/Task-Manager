import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errorMessage';

export function useAsync(loader, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const run = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const loadedData = await loader();
      setData(loadedData);
      return loadedData;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
    // The dependency list is intentionally supplied by each page-level caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refresh: run, setData };
}
