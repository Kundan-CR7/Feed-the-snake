import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Snake from "./Snake.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Snake/>
  </StrictMode>,
)
