import React, { useEffect, useState } from "react";

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    setMatches(mediaQuery.matches);

    const handleMatchChange = (event) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handleMatchChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMatchChange);
    };
  }, [query]);

  return matches;
}
