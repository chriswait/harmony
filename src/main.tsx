import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import SongProvider from './SongProvider.tsx'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SongProvider>
      <App />
    </SongProvider>
  </React.StrictMode>,
)
