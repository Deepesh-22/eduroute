import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "eduroute-theme";

const ThemeContext = createContext<
  ThemeContextValue | undefined
>(undefined);

/* =========================================================
   GET INITIAL THEME

   Priority:
   1. Saved user preference (from toggle)
   2. Default: dark (always open in dark mode)
========================================================= */

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const savedTheme =
      window.localStorage.getItem(STORAGE_KEY);

    if (
      savedTheme === "dark" ||
      savedTheme === "light"
    ) {
      return savedTheme;
    }
  } catch {
    // Ignore browser/storage errors
  }

  // Always default to dark for first-time visitors
  return "dark";
};

/* =========================================================
   APPLY THEME
========================================================= */

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") {
    return;
  }

  try {
    const html = document.documentElement;

    /*
      Main theme attribute.
      CSS uses html[data-theme="dark"]
    */
    html.setAttribute("data-theme", theme);

    /*
      Tailwind dark: support.
    */
    html.classList.toggle(
      "dark",
      theme === "dark"
    );

    /*
      Browser native UI.
    */
    html.style.colorScheme = theme;

    /*
      Save user's choice.
    */
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        theme
      );
    }
  } catch {
    // Never crash app because of theme handling
  }
};

/* =========================================================
   THEME PROVIDER
========================================================= */

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [theme, setThemeState] =
    useState<Theme>(getInitialTheme);

  /* =======================================================
     APPLY THEME WHENEVER IT CHANGES
  ======================================================= */

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,

      isDark: theme === "dark",

      toggleTheme: () => {
        setThemeState((currentTheme) =>
          currentTheme === "dark"
            ? "light"
            : "dark"
        );
      },

      setTheme: (newTheme: Theme) => {
        setThemeState(newTheme);
      },
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/* =========================================================
   USE THEME
========================================================= */

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};
