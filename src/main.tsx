import React from 'react';
import ReactDOM from 'react-dom/client';
import { ColorModeScript } from '@chakra-ui/react';

import App from './App.tsx';
import SongProvider from './SongProvider.tsx';
import ThemeProvider from './ThemeProvider.tsx';
import DatabaseProvider from './DatabaseProvider.tsx';

// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ColorModeScript />
    <React.StrictMode>
      <ThemeProvider>
        <DatabaseProvider>
          <SongProvider>
            <App />
          </SongProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </React.StrictMode>
  </>,
);
