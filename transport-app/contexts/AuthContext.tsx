"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Usuario, LoginRequest, LoginResponse } from '@/types';
import { usuarioService } from '@/services/usuario.service';

interface AuthContextType {
  usuario: Usuario | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUsuario: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage ao montar
  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      try {
        setUsuario(JSON.parse(storedUsuario));
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('usuario');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response: LoginResponse = await usuarioService.login(data);
      setUsuario(response.usuario);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  const updateUsuario = (novoUsuario: Usuario) => {
    setUsuario(novoUsuario);
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));
  };

  return (
    <AuthContext.Provider value={{ usuario, isLoading, login, logout, updateUsuario }}>
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

