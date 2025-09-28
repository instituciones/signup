import React, { useState } from 'react'
import { FormData } from '../../types/FormData'
import { PLANES } from '../../types/constants'
import { FormField, FormSelect } from '../shared/FormField'
import { Captcha } from '../shared/Captcha'

interface PaymentStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  errors: Record<string, string>
  calcularPrecioFinal: () => number
  onFormSubmit?: (captchaToken: string) => void
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  updateFormData,
  errors,
  calcularPrecioFinal,
  onFormSubmit
}) => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showCaptcha, setShowCaptcha] = useState(false)

  const onSubmit = () => {
    onFormSubmit && captchaToken && onFormSubmit(captchaToken)
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
            const cuotas = parseInt(value)
            const updates: Partial<FormData> = { installments: cuotas }

            // Si eligen 12 cuotas, marcar annualPayment como true
            // Si eligen 1-11 cuotas, marcar annualPayment como false
            if (cuotas === 12) {
              updates.annualPayment = true
            } else {
              updates.annualPayment = false
            }

            updateFormData(updates)
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

          {/* <Captcha
            onVerify={(token) => {
              setCaptchaToken(token)
              setShowCaptcha(false)
              onSubmit()
            }}
            onError={() => {
              setCaptchaToken(null)
              alert('Error en la verificación. Por favor, inténtalo de nuevo.')
            }}
            onExpire={() => {
              setCaptchaToken(null)
              alert('La verificación ha expirado. Por favor, inténtalo de nuevo.')
            }}
          />
          {captchaToken && (
            <div className="captcha-success">
              ✅ Verificación completada. Enviando información...
            </div>
          )} */}
        </div>
      )}
    </div>
  )
}