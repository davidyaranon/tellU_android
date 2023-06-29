import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ContextProvider } from './my-context';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(

  /* Allows use of global variables using the Context API  and the useContext() hook */
  <ContextProvider>

    <App />

  </ContextProvider>
);