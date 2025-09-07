import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAuthState({
        isAuthenticated: true,
        token,
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('admin_token', token);
    setAuthState({
      isAuthenticated: true,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAuthState({
      isAuthenticated: false,
      token: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
