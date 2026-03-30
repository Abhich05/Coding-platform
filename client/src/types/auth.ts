export interface User {
  id: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  login: (token: string, role: 'admin' | 'user') => void;
  logout: () => void;
}
