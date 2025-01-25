import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WebForm from './WebForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebForm />
  </StrictMode>,
)
