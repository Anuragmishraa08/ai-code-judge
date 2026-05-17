import { createContext, useEffect, useState, useContext } from 'react';
import { login as loginRequest, register as registerRequest, updateProfile as updateProfileRequest } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('aiCodeJudgeUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('aiCodeJudgeUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('aiCodeJudgeUser');
    }
  }, [user]);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerRequest(name, email, password);
    setUser(data);
    return data;
  };

  const updateProfile = async (profile) => {
    const data = await updateProfileRequest(profile);
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
