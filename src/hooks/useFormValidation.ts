import { useState } from 'react'
import { FormData } from '../types/FormData'

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number, formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0:
        if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido'
        if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido'
        if (!formData.documentType) newErrors.documentType = 'Seleccione un tipo de documento'
        if (!formData.documentNumber.trim()) newErrors.documentNumber = 'El número de documento es requerido'
        else if (!/^\d+$/.test(formData.documentNumber)) newErrors.documentNumber = 'Solo se permiten números'
        break

      case 1:
        if (!formData.areaCode.trim()) newErrors.areaCode = 'El código de área es requerido'
        else if (!/^\d+$/.test(formData.areaCode)) newErrors.areaCode = 'Solo se permiten números'
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'El teléfono es requerido'
        else if (!/^\d+$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Solo se permiten números'
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email inválido'
        }
        break

      case 4:
        if (!formData.selectedPlan) newErrors.selectedPlan = 'Debe seleccionar un plan'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = (fields: string[]) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      fields.forEach(field => delete newErrors[field])
      return newErrors
    })
  }

  return {
    errors,
    validateStep,
    clearErrors,
    setErrors
  }
}