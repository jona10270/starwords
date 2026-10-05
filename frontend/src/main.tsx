import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { App } from '@/app/App'
import { restoreSessionUseCase } from './core/di/container'

// Miro si hay una session guardada antes de pintar la app
void restoreSessionUseCase.execute();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
