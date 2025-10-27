import { useCallback, useState } from 'react';
import { toErrorMessage } from '../lib/errors';

export function useErrorMessage(initial: string | null = null) {
  const [errorMsg, setErrorMsg] = useState<string | null>(initial);

  const setError = useCallback((err: unknown, prefix?: string) => {
    const msg = toErrorMessage(err);
    setErrorMsg(prefix ? `${prefix}: ${msg}` : msg);
  }, []);

  const clearError = useCallback(() => setErrorMsg(null), []);

  return { errorMsg, setError, clearError, setErrorMsg };
}
