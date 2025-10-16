/**
 * Navbar com Autenticação Supabase
 * Exibe informações do usuário e opções de logout
 */

import React, { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export function NavbarSupabase() {
  const { user, isAuthenticated, signOut } = useSupabaseAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#dashboard" className="text-2xl font-bold text-blue-600">
              Arena Dona Santa
            </a>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <a href="#dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </a>
                <a href="#courts" className="text-gray-700 hover:text-blue-600">
                  Quadras
                </a>
                <a href="#bookings" className="text-gray-700 hover:text-blue-600">
                  Minhas Reservas
                </a>
                {user.role === 'manager' && (
                  <a href="#manager" className="text-gray-700 hover:text-blue-600">
                    Gerenciar
                  </a>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                      <a
                        href="#profile-supabase"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Meu Perfil
                      </a>
                      <a
                        href="#settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Configurações
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="#login-supabase"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </a>
                <a
                  href="#login-supabase"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Registrar
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {isAuthenticated && user ? (
              <>
                <a
                  href="#dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </a>
                <a
                  href="#courts"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Quadras
                </a>
                <a
                  href="#bookings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Minhas Reservas
                </a>
                {user.role === 'manager' && (
                  <a
                    href="#manager"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Gerenciar
                  </a>
                )}
                <a
                  href="#profile-supabase"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Meu Perfil
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#login-supabase"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login
                </a>
                <a
                  href="#login-supabase"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Registrar
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

