import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  // gives a delayed version of that value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

//<T> denotes a generic type parameter.
// Allows you to use reuseable functions,
// classes, and interfaces that work
// with a variety of types

//Basically this is saying
//Only update this value
//if nothing has changed for X milliseconds
