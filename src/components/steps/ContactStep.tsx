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
        <FormField label="Código de Área" required error={errors.phoneArea}>
          <FormInput
            value={formData.phoneArea}
            onChange={(value) => updateFormData({ phoneArea: value })}
            placeholder="011"
            error={!!errors.phoneArea}
          />
        </FormField>

        <FormField label="Teléfono" error={errors.phoneNumber}>
          <FormInput
            value={formData.phoneNumber}
            onChange={(value) => updateFormData({ phoneNumber: value })}
            placeholder="12345678"
            error={!!errors.phoneNumber}
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