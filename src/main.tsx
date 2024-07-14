import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App.tsx';
import DatabaseProvider from './DatabaseProvider.tsx';
import SongProvider from './SongProvider.tsx';
import ThemeProvider from './ThemeProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ColorModeScript />
    <React.StrictMode>
      <ThemeProvider>
        <BrowserRouter>
          <DatabaseProvider>
            <SongProvider>
              <Routes>
                <Route path="/:songId?" element={<App />} />
              </Routes>
            </SongProvider>
          </DatabaseProvider>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  </>,
);
