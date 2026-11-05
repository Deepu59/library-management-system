import { useEffect, useState } from 'react';
import api from './api';
import { AuthContext } from './auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    if (!localStorage.getItem('token')) return undefined;

    let active = true;
    api.get('/auth/me')
      .then(({ data }) => {
        if (!active) return;
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setIsLoading(false);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}