import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Erreur lors du rendu de l\'application:', error)
  // Afficher l'erreur dans la page
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; color: red;">
      <h1>Erreur de l'application</h1>
      <pre>${error.message}</pre>
      <pre>${error.stack}</pre>
    </div>
  `
}