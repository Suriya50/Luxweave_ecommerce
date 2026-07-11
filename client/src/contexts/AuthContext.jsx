import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Load user from token on mount ──────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api
        .get('/profile')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ─── OTP Authentication ──────────────────────────────────────
  const loginWithOTP = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    toast.success('Welcome!');
  };

  // ─── Email/Password Login (legacy / admin) ──────────────────
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // ─── Register (legacy) ──────────────────────────────────────
  const register = async (userData) => {
    try {
      const { data } = await api.post('/register', userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // ─── Logout ──────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  // ─── Update User Profile (for address, name, etc.) ─────────
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithOTP,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);