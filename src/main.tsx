/* ===== FILE OVERVIEW ===== */
/* Summary: Application entry point — mounts React app with BrowserRouter into DOM */

import { StrictMode } from 'react'           /* Dev-mode double-rendering for detecting side effects */
import { createRoot } from 'react-dom/client'  /* React 18 createRoot API */
import { BrowserRouter } from 'react-router-dom'  /* HTML5 history-based router */
import App from './App'                       /* Root App component */
import './index.css'                          /* Global CSS styles */

/* ===== MOUNT ===== */
createRoot(document.getElementById('root')!).render(  /* Grab #root element (assert non-null) */
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
