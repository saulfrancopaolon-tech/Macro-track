import { useState, useEffect, useRef } from "react";

// Works just like useState, but persists to localStorage under `key`.
// `initialValue` can be a value or a function (lazy init), same as useState.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {
      // ignore corrupted storage
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  const first = useRef(true);
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // storage full or unavailable — fail silently
    }
  }, [key, value]);

  return [value, setValue];
}
