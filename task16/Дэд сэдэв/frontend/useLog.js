import { useState, useCallback, useRef } from 'react';

export function useLog() {
  const [entries, setEntries] = useState([]);
  const idRef = useRef(0);

  const add = useCallback((text, type = 'info') => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    setEntries(prev => [...prev, { id: idRef.current++, text, type, time }]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return { entries, add, clear };
}
