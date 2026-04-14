import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FreeDrawing from './free-drawing.jsx'
import Challenge from './Challenge.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/free-drawing' element={<FreeDrawing />} />
        <Route path='/challenge-mode' element={<Challenge />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
