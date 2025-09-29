import React from 'react'
import { FormData } from '../../types/FormData'
import { PLANES } from '../../types/constants'
import { FormField, FormSelect } from '../shared/FormField'

interface PaymentStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  errors: Record<string, string>
  calcularPrecioFinal: () => number
  onFormSubmit?: () => void
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  updateFormData,
  errors,
  calcularPrecioFinal,
  onFormSubmit
}) => {

  // Verificar installments en cada render
  console.log('🔍 PaymentStep render - installments:', formData.installments, typeof formData.installments)
  if (isNaN(formData.installments) || typeof formData.installments !== 'number') {
    console.error('❌ INSTALLMENTS NO ES VÁLIDO EN PAYMENTSTEP:', formData.installments)
  }

  const onSubmit = () => {
    onFormSubmit && onFormSubmit()
  }

  return (
    <div className="step-content">
      <FormField label="Plan" required error={errors.selectedPlan}>
        <FormSelect
          value={formData.selectedPlan || ''}
          onChange={(value) => updateFormData({ selectedPlan: value })}
          options={PLANES.map(plan => ({ value: plan.id, label: `${plan.name} - $${plan.price.toLocaleString()}` }))}
          placeholder="Seleccione un plan"
          error={!!errors.selectedPlan}
        />
      </FormField>

      <FormField label="Cantidad de cuotas" required>
        <FormSelect
          value={formData.installments.toString()}
          onChange={(value) => {
            console.log('=== PaymentStep installments onChange ===')
            console.log('Valor recibido:', value, typeof value)
            console.log('formData.installments actual:', formData.installments, typeof formData.installments)

            // Validación más robusta para Android
            if (!value || value === '') {
              console.log('Valor vacío recibido, no actualizando')
              return
            }

            const cuotas = parseInt(value, 10)
            console.log('parseInt(value, 10):', cuotas, typeof cuotas, 'isNaN:', isNaN(cuotas))

            // Validar que el número está en el rango correcto
            if (isNaN(cuotas) || cuotas < 1 || cuotas > 12) {
              console.error('Valor de cuotas inválido:', cuotas)
              return
            }

            const updates: Partial<FormData> = { installments: cuotas }
            console.log('Updates que se van a aplicar:', updates)

            // Si eligen 12 cuotas, marcar annualPayment como true
            // Si eligen 1-11 cuotas, marcar annualPayment como false
            if (cuotas === 12) {
              updates.annualPayment = true
              console.log('12 cuotas seleccionadas, annualPayment = true')
            } else {
              updates.annualPayment = false
              console.log(`${cuotas} cuotas seleccionadas, annualPayment = false`)
            }

            console.log('Llamando updateFormData con:', updates)

            // Usar setTimeout para evitar problemas de timing en Android
            setTimeout(() => {
              updateFormData(updates)
            }, 0)
          }}
          options={Array.from({ length: 12 }, (_, i) => {
            const cuota = i + 1
            return {
              value: cuota.toString(),
              label: `${cuota} cuota${cuota > 1 ? 's' : ''}`
            }
          })}
          placeholder="Seleccione cantidad de cuotas"
        />
      </FormField>

      {formData.selectedPlan && (
        <div className="resumen-pago">
          <h4>Resumen del Pago</h4>
          <div className="resumen-row">
            <span>Plan: {PLANES.find(p => p.id === formData.selectedPlan)?.name}</span>
            <span>Modalidad: {formData.annualPayment ? 'Anual (10 cuotas)' : 'Mensual'} {formData.hasDebt ? '+ reinscripcion' : ''}</span>
          </div>
          <div className="resumen-total">
            <strong>Total: ${calcularPrecioFinal().toLocaleString()}</strong>
          </div>
          {formData.annualPayment && (
            <p className="ahorro">
              ¡Ahorrás ${(PLANES.find(p => p.id === formData.selectedPlan)?.price || 0) * 2}!
            </p>
          )}
        </div>
      )}
    </div>
  )
}