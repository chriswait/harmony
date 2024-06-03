import { createContext, useContext, useState } from "react"
import { useMediaQuery } from "react-responsive";

const ThemeContext = createContext<{
  isMd: boolean,
  isLg: boolean,
  isDark: boolean,
  zoom: number,
  setZoom: React.Dispatch<React.SetStateAction<number>>,
}>({
  isMd: false,
  isLg: false,
  isDark: false,
  zoom: 1,
  setZoom: () => { }
});
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const isMd = useMediaQuery({ query: '(min-width: 776px)' })
  const isLg = useMediaQuery({ query: '(min-width: 996px)' })
  const isDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" })
  const [zoom, setZoom] = useState(3);
  return (
    <ThemeContext.Provider value={{ isMd, isLg, isDark, zoom, setZoom }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;