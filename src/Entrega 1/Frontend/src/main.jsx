import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// CSS base: escolha APENAS um. Aqui uso Minty (verde claro)
import 'bootswatch/dist/minty/bootstrap.min.css'
// JS do Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Ícones (opcional)
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Seu CSS por último (override das variáveis)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
