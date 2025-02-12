import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'log') {
        console.log('Iframe log:', ...event.data.args);
      }
    };
  
  
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  

  return [value, setValue];
}

export default useLocalStorage;
