import { useEffect, useState } from 'react';

// Hash routing (#/rag-ai) keeps deep links working on GitHub Pages without a 404.html fallback.
const read = () => window.location.hash.replace(/^#\/?/, '');

export function useHashRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (id) => {
    window.location.hash = `/${id}`;
  };

  return [route, navigate];
}
