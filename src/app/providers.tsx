'use client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';
import { ReactNode, useEffect, useState } from 'react';
import { loadAuth } from '../lib/authStorage';
import { setAuth } from '../store/authSlice';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    const saved = loadAuth();
    if (saved && (saved.token || saved.user)) {
      store.dispatch(setAuth({ token: saved.token, user: saved.user }));
    }
  }, []);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
