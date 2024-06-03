import { createContext, useContext, useState } from "react"
import { useMediaQuery } from "react-responsive";
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}
const theme = extendTheme({ config })

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
  const [zoom, setZoom] = useState(2);
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ThemeContext.Provider value={{ isMd, isLg, isDark, zoom, setZoom }}>
        {children}
      </ThemeContext.Provider>
    </ChakraProvider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;