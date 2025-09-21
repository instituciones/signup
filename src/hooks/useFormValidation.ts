import { useState } from 'react'
import { FormData } from '../types/FormData'

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number, formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0:
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido'
        if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Seleccione un tipo de documento'
        if (!formData.documento.trim()) newErrors.documento = 'El número de documento es requerido'
        else if (!/^\d+$/.test(formData.documento)) newErrors.documento = 'Solo se permiten números'
        break

      case 1:
        if (!formData.codigoArea.trim()) newErrors.codigoArea = 'El código de área es requerido'
        else if (!/^\d+$/.test(formData.codigoArea)) newErrors.codigoArea = 'Solo se permiten números'
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido'
        else if (!/^\d+$/.test(formData.telefono)) newErrors.telefono = 'Solo se permiten números'
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email inválido'
        }
        break

      case 4:
        if (!formData.planSeleccionado) newErrors.planSeleccionado = 'Debe seleccionar un plan'
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