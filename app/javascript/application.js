// Entry point for the build script in your package.json
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";

import App from './App';

const queryClient = new QueryClient();

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('react-root');
  if (node) {
    ReactDOM.render(
      <>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </>, node
    );
  }
});
