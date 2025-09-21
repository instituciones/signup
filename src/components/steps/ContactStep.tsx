import React from 'react'
import { FormData } from '../../types/FormData'
import { FormField, FormInput } from '../shared/FormField'

interface ContactStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  errors: Record<string, string>
}

export const ContactStep: React.FC<ContactStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  return (
    <div className="step-content">
      <div className="form-row">
        <FormField label="Código de Área" required error={errors.codigoArea}>
          <FormInput
            value={formData.codigoArea}
            onChange={(value) => updateFormData({ codigoArea: value })}
            placeholder="011"
            error={!!errors.codigoArea}
          />
        </FormField>

        <FormField label="Teléfono" required error={errors.telefono}>
          <FormInput
            value={formData.telefono}
            onChange={(value) => updateFormData({ telefono: value })}
            placeholder="12345678"
            error={!!errors.telefono}
          />
        </FormField>
      </div>

      <FormField label="Email" fullWidth error={errors.email}>
        <FormInput
          type="email"
          value={formData.email}
          onChange={(value) => updateFormData({ email: value })}
          placeholder="ejemplo@email.com (opcional)"
          error={!!errors.email}
        />
      </FormField>
    </div>
  )
}