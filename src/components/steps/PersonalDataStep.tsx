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
      <FormField label="Nombre" required error={errors.nombre}>
        <FormInput
          value={formData.nombre}
          onChange={(value) => updateFormData({ nombre: value })}
          placeholder="Nombre"
          error={!!errors.nombre}
        />
      </FormField>

      <FormField label="Apellido" required error={errors.apellido}>
        <FormInput
          value={formData.apellido}
          onChange={(value) => updateFormData({ apellido: value })}
          placeholder="Apellido"
          error={!!errors.apellido}
        />
      </FormField>

      <FormField label="Tipo" required error={errors.tipoDocumento}>
        <FormSelect
          value={formData.tipoDocumento}
          onChange={(value) => updateFormData({ tipoDocumento: value })}
          options={TIPOS_DOCUMENTO}
          placeholder="Tipo de documento"
          error={!!errors.tipoDocumento}
        />
      </FormField>

      <FormField label="Número" required error={errors.documento}>
        <FormInput
          value={formData.documento}
          onChange={(value) => updateFormData({ documento: value })}
          placeholder="Número de documento"
          error={!!errors.documento}
        />
      </FormField>
    </div>
  )
}