import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set the base URL for axios requests
// Use environment variable or fallback to production URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://itskillhub.onrender.com';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
// deploy-fix
