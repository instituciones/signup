import { FormData } from '../types/FormData'

export interface RegistrationPayload extends FormData {
  captchaToken: string
}

export interface RegistrationResponse {
  success: boolean
  id?: string
  message?: string
  error?: string
}

class RegistrationApiService {
  private baseUrl: string

  constructor() {
    // Por ahora usar una URL de ejemplo - en producción deberías usar variables de entorno
    this.baseUrl = process.env.REACT_APP_API_URL || 'https://api.clubalianza.com'
  }

  async submitRegistration(data: RegistrationPayload): Promise<RegistrationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/socios/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result

    } catch (error) {
      console.error('Error submitting registration:', error)

      // Por ahora simular una respuesta exitosa para testing
      // En producción deberías manejar el error apropiadamente
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: simulating successful registration')
        return {
          success: true,
          id: 'dev-' + Date.now(),
          message: 'Registro simulado exitosamente (modo desarrollo)'
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  async validateCaptcha(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/captcha/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      return result.success || false

    } catch (error) {
      console.error('Error validating captcha:', error)

      // En desarrollo, aceptar cualquier token
      if (process.env.NODE_ENV === 'development') {
        return true
      }

      return false
    }
  }
}

export const registrationApi = new RegistrationApiService()