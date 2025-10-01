import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LoginForm } from '../admin/LoginForm'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar el formulario de login
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={login} />
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>
}