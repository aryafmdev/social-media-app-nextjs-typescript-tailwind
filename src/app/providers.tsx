'use client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';
import { ReactNode, useEffect, useState } from 'react';
import { loadAuth, saveAuth } from '../lib/authStorage';
import { setAuth } from '../store/authSlice';
import { getMe } from '../lib/api/me';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    const saved = loadAuth();
    if (saved && (saved.token || saved.user)) {
      store.dispatch(setAuth({ token: saved.token, user: saved.user }));
    }
    const token = saved?.token;
    const user = saved?.user;
    if (token) {
      getMe(token)
        .then((me) => {
          const updatedUser = {
            email: (me.email && me.email.trim()) || user?.email || '',
            name: (me.name && me.name.trim()) || user?.name,
            username: (me.username && me.username.trim()) || user?.username,
            phone: (me.phone && me.phone.trim()) || user?.phone,
          };
          store.dispatch(setAuth({ token, user: updatedUser }));
          saveAuth(token, updatedUser);
        })
        .catch(() => {});
    }
  }, []);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
