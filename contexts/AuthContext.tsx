'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string;
  email: string;
  planType?: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, token?: string) => Promise<boolean>;
  logout: () => void;
  validateToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se já está autenticado ao carregar (apenas uma vez)
    if (!hasCheckedAuth) {
      checkAuth();
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth]);

  async function checkAuth() {
    const savedToken = localStorage.getItem('accessToken');
    const savedUserData = localStorage.getItem('userData');

    // Check if it's a test token - always accept without validation
    if (savedToken && savedToken.startsWith('test-free-trial-')) {
      const testUser = {
        name: 'Usuário Teste',
        email: 'teste@soulsync.com',
        planType: 'free-trial'
      };

      // Save test user data if not already saved
      if (!savedUserData) {
        localStorage.setItem('userData', JSON.stringify(testUser));
      }

      setUser(savedUserData ? JSON.parse(savedUserData) : testUser);
      setIsLoading(false);
      return;
    }

    // Check if it's a local user (created in thank you page)
    if (savedToken && savedToken.startsWith('local-')) {
      if (savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          // Aceitar usuário local
          setUser(userData);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Erro ao carregar dados do usuário local:', error);
        }
      }
    }

    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        // Aceitar tanto usuários com token quanto usuários locais
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }

  async function validateToken(token: string): Promise<boolean> {
    try {
      // Test tokens are always valid
      if (token.startsWith('test-free-trial-')) {
        const testUser = {
          name: 'Usuário Teste',
          email: 'teste@soulsync.com',
          planType: 'free-trial'
        };

        localStorage.setItem('accessToken', token);
        localStorage.setItem('userData', JSON.stringify(testUser));
        setUser(testUser);
        return true;
      }

      const response = await fetch(`/api/validate-token?token=${token}`);
      const data = await response.json();

      if (data.valid) {
        const userData = {
          name: data.name,
          email: data.email,
          planType: data.planType
        };

        // Salvar token e dados do usuário
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  async function login(email: string, password?: string): Promise<boolean> {
    setIsLoading(true);
    try {
      // Login com email e senha (usuário local criado na página de obrigado)
      const savedUserData = localStorage.getItem('userData');

      console.log('=== DEBUG LOGIN ===');
      console.log('Email fornecido:', email);
      console.log('Senha fornecida:', password);
      console.log('userData salvo:', savedUserData);

      if (savedUserData) {
        const userData = JSON.parse(savedUserData);

        console.log('userData parseado:', userData);
        console.log('isLocalUser:', userData.isLocalUser);
        console.log('Email salvo:', userData.email);
        console.log('Senha salva:', userData.password);
        console.log('Email match:', userData.email.toLowerCase() === email.toLowerCase());
        console.log('Password match:', userData.password === password);

        // Verificar se é usuário local e se credenciais conferem
        if (userData.isLocalUser &&
            userData.email.toLowerCase() === email.toLowerCase() &&
            userData.password === password) {
          console.log('✅ Login bem-sucedido!');
          setUser(userData);
          setIsLoading(false);
          return true;
        }
      }

      // Email/senha não encontrados ou incorretos
      console.log('❌ Login falhou');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setIsLoading(false);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    setUser(null);
    router.push('/');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
