import React, { createContext, useEffect } from "react";

export const ThemeContext = createContext();

const defaultTheme = "light";
const darkTheme = "dark";

export default function ThemeProvider({ children }) {
  /**
   * toggleTheme gets the current theme, then it sets the new theme to the opposite of the current theme
   */
  const toggleTheme = () => {
    const oldTheme = getTheme();
    const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;

    updateTheme(newTheme, oldTheme);
  };

  /* useEffectchecking if there's a theme in localStorage, and if there is, it's updating the theme. */
  useEffect(() => {
    const theme = getTheme();
    if (!theme) updateTheme(defaultTheme);
    else updateTheme(theme);
  }, []);
  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * It returns the value of the "theme" key in localStorage.
 */
const getTheme = () => localStorage.getItem("theme");

/**
 * If there's a theme to remove, remove it, then add the new theme, and save it to local storage.
 * @param theme - The theme to add.
 * @param themeToRemove - The theme to remove from the document.
 */
const updateTheme = (theme, themeToRemove) => {
  if (themeToRemove) document.documentElement.classList.remove(themeToRemove);
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
};
