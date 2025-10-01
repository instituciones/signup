import React, { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN, LoginInput, LoginResponse } from '../../graphql/mutations'

interface LoginFormProps {
  onLoginSuccess: (token: string, user: any) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [login, { loading }] = useMutation<LoginResponse, { input: LoginInput }>(LOGIN, {
    onCompleted: (data) => {
      const { token, user } = data.login
      onLoginSuccess(token, user)
    },
    onError: (error) => {
      console.error('Login error:', error)
      setErrors({ general: 'Credenciales incorrectas' })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validación básica
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email es requerido'
    if (!formData.password) newErrors.password = 'Contraseña es requerida'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await login({
        variables: { input: formData }
      })
    } catch (error) {
      // Error handled in onError callback
    }
  }

  const handleInputChange = (field: keyof LoginInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Acceso Administrador</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="admin@ejemplo.com"
              disabled={loading}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="Tu contraseña"
              disabled={loading}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}