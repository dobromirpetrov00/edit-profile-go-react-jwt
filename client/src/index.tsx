/**
 * Renders the main React application with the Mantine UI provider.
 * This is the entry point of the application, where the root React component is rendered.
 * The Mantine UI provider is used to provide the Mantine theme and global styles to the application.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { MantineProvider } from '@mantine/core';

// Create a root for the React application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the application
root.render(
  // Wrap the app in React.StrictMode for additional checks and warnings
  <React.StrictMode>
    {/* Wrap the entire application with MantineProvider for theming and styling */}
    <MantineProvider >
      {/* Render the main App component */}
      <App />
    </MantineProvider>
  </React.StrictMode>
);