import { useState, useEffect } from "react";

export const useAnimations = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return {
    isLoaded,
    isHovering,
    setIsHovering,
  };
};