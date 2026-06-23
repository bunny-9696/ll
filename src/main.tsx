import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and prevent propagation of benign development/websocket/HMR/Script errors in the sandboxed preview iframe
if (typeof window !== 'undefined') {
  const isBenignError = (msg: string) => {
    if (!msg) return false;
    const normalized = msg.toLowerCase();
    return (
      normalized.includes('websocket') ||
      normalized.includes('script error') ||
      normalized.includes('hmr') ||
      normalized.includes('connection failed') ||
      normalized.includes('closed without opened')
    );
  };

  window.addEventListener('error', (event) => {
    if (isBenignError(event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error ? reason.message : String(reason);
    if (isBenignError(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
