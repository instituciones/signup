import React from 'react'
import { FormData } from '../../types/FormData'
import { TIPOS_DOCUMENTO } from '../../types/constants'
import { FormField, FormInput, FormSelect } from '../shared/FormField'

interface PersonalDataStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  errors: Record<string, string>
}

export const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  return (
    <div className="step-content">
      <FormField label="Nombre" required error={errors.firstName}>
        <FormInput
          value={formData.firstName}
          onChange={(value) => updateFormData({ firstName: value })}
          placeholder="Nombre"
          error={!!errors.firstName}
        />
      </FormField>

      <FormField label="Apellido" required error={errors.lastName}>
        <FormInput
          value={formData.lastName}
          onChange={(value) => updateFormData({ lastName: value })}
          placeholder="Apellido"
          error={!!errors.lastName}
        />
      </FormField>

      <FormField label="Tipo" required error={errors.documentType}>
        <FormSelect
          value={formData.documentType}
          onChange={(value) => updateFormData({ documentType: value })}
          options={TIPOS_DOCUMENTO}
          placeholder="Tipo de documento"
          error={!!errors.documentType}
        />
      </FormField>

      <FormField label="Número" required error={errors.documentNumber}>
        <FormInput
          value={formData.documentNumber}
          onChange={(value) => updateFormData({ documentNumber: value })}
          error={!!errors.documentNumber}
        />
      </FormField>
    </div>
  )
}