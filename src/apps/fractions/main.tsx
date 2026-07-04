import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '../../index.css';
import { initDB } from '../../shared/db/db.ts';

initDB('MutinyDB_Fractions');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
