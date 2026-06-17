import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "react-hot-toast"
import { queryClient } from './app/queryClient.js'
import { AuthProvider } from "./components/auth/AuthContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#fff',
              border: '1px solid #27272a',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#eab308', secondary: '#000' },
            },
          }}
        />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
