import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

function useApplicationTheme() {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, [resolvedTheme]);
  return theme;
}

export default useApplicationTheme;
