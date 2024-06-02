import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import SongProvider from './SongProvider.tsx'
import ThemeProvider from './ThemeProvider.tsx'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SongProvider>
        <App />
      </SongProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
