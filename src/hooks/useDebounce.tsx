import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // Configurar un temporizador que actualizará el valor después del retraso
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Limpiar el temporizador si el valor cambia antes de que expire el retraso
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

export default useDebounce;