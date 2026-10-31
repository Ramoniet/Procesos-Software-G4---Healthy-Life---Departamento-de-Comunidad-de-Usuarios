import { useEffect, useState } from 'react';

/** Almacenamiento temporal para la demo sin backend (por navegador y dispositivo). */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Si el almacenamiento está bloqueado o lleno, la demo sigue en memoria.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
