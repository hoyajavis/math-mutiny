import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  currentUser: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('math_mutiny_current_user');
    if (saved) {
      setCurrentUser(saved);
    }
    setIsLoaded(true);
  }, []);

  const login = (name: string) => {
    const cleanName = name.trim().toLowerCase();
    if (cleanName) {
      setCurrentUser(cleanName);
      localStorage.setItem('math_mutiny_current_user', cleanName);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('math_mutiny_current_user');
  };

  if (!isLoaded) return null;

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
