import { useState, useEffect } from 'react';

// get width changes from the UI
export const useWindowWidthResize = () => {
    const [width, setWidth] = useState(window.innerWidth);
  
    const listener = () => {
      setWidth(window.innerWidth);
    };
  
    useEffect(() => {
      window.addEventListener("resize", listener);
      return () => {
        window.removeEventListener("resize", listener);
      };
    }, [window.innerWidth]);
  
    return {
      width
    };
  };