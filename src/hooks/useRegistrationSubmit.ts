import { useState } from 'react'
import { FormData } from '../types/FormData'
import { registrationApi, RegistrationResponse } from '../services/registrationApi'

export const useRegistrationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [registrationId, setRegistrationId] = useState<string | null>(null)

  const submitRegistration = async (formData: FormData, captchaToken: string): Promise<RegistrationResponse> => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const result = await registrationApi.submitRegistration({
        ...formData,
        captchaToken
      })

      if (result.success) {
        setSubmitSuccess(true)
        setRegistrationId(result.id || null)
      } else {
        setSubmitError(result.error || 'Error al enviar el registro')
      }

      return result

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setSubmitError(errorMessage)

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetSubmission = () => {
    setSubmitError(null)
    setSubmitSuccess(false)
    setRegistrationId(null)
  }

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    registrationId,
    submitRegistration,
    resetSubmission
  }
}