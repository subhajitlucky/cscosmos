import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'
import { initializeGoogleAnalytics } from './lib/googleAnalytics.ts'

if (import.meta.env.PROD) {
  initializeGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
