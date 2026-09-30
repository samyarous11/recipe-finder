import { useEffect, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Runs an async loader whenever `key` changes; ignores stale responses. */
export function useFetch<T>(loader: () => Promise<T>, key: string | null): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, loading: false, error: null });

  useEffect(() => {
    if (key === null) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    loader()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((e: Error) => !cancelled && setState({ data: null, loading: false, error: e.message }));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
