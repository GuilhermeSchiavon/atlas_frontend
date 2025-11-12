'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser, logout } from '@/utils/auth';
import { User } from '@/types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Atlas Dermatológico
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-secondary transition-colors">
              Início
            </Link>
            <Link href="/categorias" className="hover:text-secondary transition-colors">
              Temas
            </Link>
            {user ? (
              <>
                <Link href="/submit" className="hover:text-secondary transition-colors">
                  Enviar Publicação
                </Link>
                <Link href="/profile" className="hover:text-secondary transition-colors">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-secondary transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-secondary transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-secondary">
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-secondary"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 hover:text-secondary">
                Início
              </Link>
              <Link href="/categorias" className="block px-3 py-2 hover:text-secondary">
                Temas
              </Link>
              {user ? (
                <>
                  <Link href="/submit" className="block px-3 py-2 hover:text-secondary">
                    Enviar Publicação
                  </Link>
                  <Link href="/profile" className="block px-3 py-2 hover:text-secondary">
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-3 py-2 hover:text-secondary w-full text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-3 py-2 hover:text-secondary">
                    Login
                  </Link>
                  <Link href="/auth/register" className="block px-3 py-2 hover:text-secondary">
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}