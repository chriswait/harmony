import { createContext, useContext } from "react"
import { useMediaQuery } from "react-responsive";

const ThemeContext = createContext({
  isMd: false,
  isLg: false,
  isDark: false,
});
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const isMd = useMediaQuery({ query: '(min-width: 776px)' })
  const isLg = useMediaQuery({ query: '(min-width: 996px)' })
  const isDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" })
  return (
    <ThemeContext.Provider value={{ isMd, isLg, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;