import { createContext, useContext, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};
const theme = extendTheme({ config });

const ThemeContext = createContext<{
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  zoom: 1,
  setZoom: () => {},
  isEditing: false,
  setIsEditing: () => {},
});
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [zoom, setZoom] = useState(2);
  const [isEditing, setIsEditing] = useState(true);
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ThemeContext.Provider value={{ zoom, setZoom, isEditing, setIsEditing }}>
        {children}
      </ThemeContext.Provider>
    </ChakraProvider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;
