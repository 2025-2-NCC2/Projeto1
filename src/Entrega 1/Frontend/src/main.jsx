import React from 'react'
import ReactDOM from 'react-dom/client'

// CSS base: escolha APENAS um. Aqui uso Minty (verde claro)
import 'bootswatch/dist/minty/bootstrap.min.css'
// JS do Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Ícones (opcional)
import 'bootstrap-icons/font/bootstrap-icons.css'


// Seu CSS por último (override das variáveis)
import './index.css'

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)