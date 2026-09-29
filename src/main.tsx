import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/lalezar/arabic-400.css'
import '@fontsource/lalezar/latin-400.css'
import '@fontsource/cairo/arabic-700.css'
import '@fontsource/cairo/arabic-800.css'
import '@fontsource/cairo/latin-700.css'
import '@fontsource/fredoka/latin-600.css'
import '@fontsource/fredoka/latin-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
