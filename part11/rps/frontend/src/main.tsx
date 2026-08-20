import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/shared/styles/tokens.css';
import '@/shared/styles/global.css';

import App from '@/app/App.tsx';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Error: root is missing in index.html');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
