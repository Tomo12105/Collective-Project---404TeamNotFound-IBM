import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--color-surface-2)',
            color:      'var(--color-text)',
            border:     '1px solid var(--color-border)',
            fontSize:   'var(--text-sm)',
            borderRadius: 'var(--radius-md)',
            boxShadow:  'var(--shadow-md)',
          },
          success: { iconTheme: { primary: 'var(--color-success)', secondary: 'var(--color-surface-2)' } },
          error:   { iconTheme: { primary: 'var(--color-error)',   secondary: 'var(--color-surface-2)' } },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
