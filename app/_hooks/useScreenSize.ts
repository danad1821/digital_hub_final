// hooks/useScreenSize.ts (or you can define it at the top of your component)
import { useState, useEffect } from 'react';

/**
 * Custom hook to get and track the current window size (width and height).
 * It updates automatically when the window is resized.
 * * @returns {{ width: number | undefined, height: number | undefined }} The current screen dimensions.
 */
export function useScreenSize() {
  // Initialize state with undefined so we can run the check only on the client
  // side, avoiding SSR (Server-Side Rendering) issues.
  const [screenSize, setScreenSize] = useState<{ width: number | undefined; height: number | undefined }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Set initial size immediately when the component mounts
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return screenSize;
}