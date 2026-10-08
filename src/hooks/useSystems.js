import { useEffect, useState } from 'react';

const base = import.meta.env.BASE_URL;
const cache = new Map();

function fetchJson(path) {
  if (!cache.has(path)) {
    const request = fetch(`${base}systems/${path}`).then((res) => {
      if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
      return res.json();
    });
    request.catch(() => cache.delete(path));
    cache.set(path, request);
  }
  return cache.get(path);
}

function useJson(path) {
  const [state, setState] = useState({ data: null, error: null, loading: Boolean(path) });

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchJson(path)
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}

export const useCatalog = () => useJson('index.json');
export const useSystem = (file) => useJson(file);
