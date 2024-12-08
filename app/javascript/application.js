// Entry point for the build script in your package.json
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

import App from './App';

const queryClient = new QueryClient();

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-root');
  const root = createRoot(container);
  root.render(
    <>
      <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </>
  );
});
