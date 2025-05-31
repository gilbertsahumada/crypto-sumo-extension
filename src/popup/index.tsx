import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Popup } from './popup';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <div className="h-[720px] w-[320px]">
      <Popup />
    </div>
  </React.StrictMode>,
);
