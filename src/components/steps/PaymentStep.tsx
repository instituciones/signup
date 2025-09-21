import React from 'react'
import { FormData } from '../../types/FormData'
import { PLANES } from '../../types/constants'
import { FormField, FormSelect } from '../shared/FormField'

interface PaymentStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  errors: Record<string, string>
  calcularPrecioFinal: () => number
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  updateFormData,
  errors,
  calcularPrecioFinal
}) => {
  return (
    <div className="step-content">
      <FormField label="Plan" required error={errors.planSeleccionado}>
        <FormSelect
          value={formData.planSeleccionado || ''}
          onChange={(value) => updateFormData({ planSeleccionado: value })}
          options={PLANES.map(plan => ({ value: plan.id, label: `${plan.nombre} - $${plan.precio.toLocaleString()}` }))}
          placeholder="Seleccione un plan"
          error={!!errors.planSeleccionado}
        />
      </FormField>

      <div className="pago-anual">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.pagoAnual}
            onChange={(e) => updateFormData({ pagoAnual: e.target.checked })}
          />
          Pago anual (10 cuotas) - 2 meses gratis
        </label>
      </div>

      {formData.planSeleccionado && (
        <div className="resumen-pago">
          <h4>Resumen del Pago</h4>
          <div className="resumen-row">
            <span>Plan: {PLANES.find(p => p.id === formData.planSeleccionado)?.nombre}</span>
            <span>Modalidad: {formData.pagoAnual ? 'Anual (10 cuotas)' : 'Mensual'}</span>
          </div>
          <div className="resumen-total">
            <strong>Total: ${calcularPrecioFinal().toLocaleString()}</strong>
          </div>
          {formData.pagoAnual && (
            <p className="ahorro">
              ¡Ahorrás ${(PLANES.find(p => p.id === formData.planSeleccionado)?.precio || 0) * 2}!
            </p>
          )}
        </div>
      )}
    </div>
  )
}