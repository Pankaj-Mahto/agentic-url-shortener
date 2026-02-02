import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load token & user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optional: fetch current user from /api/auth/me
      // For simplicity, assume token is valid
      setUser({ token }); // placeholder - expand later with /me call
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    toast.success('Logged in successfully');
    navigate('/dashboard');
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
    navigate('/login');
  };

  // Axios-like wrapper with auth header & error handling
  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    console.log('API call:', url, options.method || 'GET'); 
    
    try {
      const res = await fetch(`http://localhost:5000${url}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          toast.error('Session expired. Please log in again.');
        }
        const err = await res.json();
        throw new Error(err.message || 'API request failed');
      }

      return await res.json();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      throw err;
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, apiCall }}>
      {children}
    </AuthContext.Provider>
  );
};