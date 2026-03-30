import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from 'react';

type Role = 'admin' | 'recruiter' | 'candidate';

interface User {
  id: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface Props {
  children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role) {
          setUser({
            id: payload.userId || payload.id || 'unknown',
            role: payload.role as Role,
          });
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token: string, role: Role) => {
    localStorage.setItem('token', token);
    setUser({ id: 'temp-id', role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
