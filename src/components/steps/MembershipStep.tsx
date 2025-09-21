import React from 'react'
import { FormData } from '../../types/FormData'
import { FormField, FormInput } from '../shared/FormField'

interface MembershipStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  errors: Record<string, string>
}

export const MembershipStep: React.FC<MembershipStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  return (
    <div className="step-content">
      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.esSocio}
            onChange={(e) => updateFormData({ esSocio: e.target.checked })}
          />
          ¿Fuiste socio?
        </label>
      </div>

      {formData.esSocio && (
        <>
          <FormField label="Número de Socio" error={errors.numeroSocio}>
            <FormInput
              value={formData.numeroSocio || ''}
              onChange={(value) => updateFormData({ numeroSocio: value })}
              placeholder="Número de socio (opcional)"
              error={!!errors.numeroSocio}
            />
          </FormField>

          <div className="amnesty-message">
            <h4>🎉 ¡Adhesión a la Amnistía 2024!</h4>
            <p>
              Como ex-socio, podés adherir a nuestra <strong>Amnistía 2024</strong>:
            </p>
            <p>• Condonación total de deudas anteriores</p>
            <p>• Reactivación inmediata de beneficios</p>
            <p>• <strong>¡Comenzá de nuevo sin compromisos pendientes!</strong></p>
          </div>
        </>
      )}
    </div>
  )
}