import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'react-quill-new/dist/quill.snow.css'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { A11yProvider } from './context/A11yContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <DataProvider>
          <A11yProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </A11yProvider>
        </DataProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
