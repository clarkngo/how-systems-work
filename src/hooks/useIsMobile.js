import { useSyncExternalStore } from 'react';

// Matches Tailwind's `md` breakpoint: below 768px we switch to the mobile layout.
const query = '(max-width: 767px)';

const subscribe = (onChange) => {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

export const useIsMobile = () => useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
