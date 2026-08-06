import { useEffect, useState } from 'react';

/** Simulates a brief content load so pages can show their loading state. */
export default function useLoading(deps = [], ms = 420) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return loading;
}
