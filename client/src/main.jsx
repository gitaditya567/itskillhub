import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set the base URL for axios requests
// Hardcoded for reliability during deployment debugging
axios.defaults.baseURL = 'https://itskillhub.onrender.com';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
// deploy-fix
