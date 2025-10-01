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
      <div className="form-group switch-group">
        <label className="switch-label">
          ¿Fuiste socio?
        </label>
        <div className="switch-container">
          <span className={`switch-text ${!formData.isMember ? 'active' : ''}`}>No</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={formData.isMember}
              onChange={(e) => updateFormData({ isMember: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
          <span className={`switch-text ${formData.isMember ? 'active' : ''}`}>Sí</span>
        </div>
      </div>

      {formData.isMember && (
        <>
          <FormField label="Número de Socio" error={errors.memberNumber}>
            <FormInput
              value={formData.memberNumber || ''}
              onChange={(value) => updateFormData({ memberNumber: value })}
              placeholder="(opcional)"
              error={!!errors.memberNumber}
            />
          </FormField>
        </>
      )}

      <div className="form-group switch-group">
        <label className="switch-label">
          ¿Tienes deuda?
        </label>
        <div className="switch-container">
          <span className={`switch-text ${!formData.hasDebt ? 'active' : ''}`}>No</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={formData.hasDebt}
              onChange={(e) => updateFormData({ hasDebt: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
          <span className={`switch-text ${formData.hasDebt ? 'active' : ''}`}>Sí</span>
        </div>
      </div>
      {formData.hasDebt && (
        <div className="amnesty-message">
          <h4>🎉 ¡Adhesión a la Amnistía 2025!</h4>
          <p>• Condonación total de deudas anteriores</p>
          <p>• Reactivación inmediata de beneficios</p>
          <p>Deberas abonar la cuota actual + una cuota de reinscripcion.</p>
        </div>
      )}
    </div>
  )
}