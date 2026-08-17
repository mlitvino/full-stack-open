import { useEffect, useState } from 'react';

/**
 * Returns `value` delayed by `delay` milliseconds, so that rapid changes
 * (such as typing) result in a single update once the input settles.
 */
const useDebouncedValue = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

export default useDebouncedValue;
