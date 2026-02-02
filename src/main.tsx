import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App.tsx';
import './index.css';

// biome-ignore lint/style/noNonNullAssertion: This is the main entry point
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
