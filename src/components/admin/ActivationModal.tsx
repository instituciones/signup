import React from 'react'
import { ProvisionalRecord } from '../../types/graphql'
import { PLANES } from '../../types/constants'

interface PaymentPlan {
  year: number
  month: number
  amount: number
}

interface ActivationModalProps {
  record: ProvisionalRecord
  isOpen: boolean
  onClose: () => void
  onConfirm: (payments: PaymentPlan[]) => void
  isLoading?: boolean
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  record,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  if (!isOpen) return null

  const calculatePayments = (): PaymentPlan[] => {
    const plan = PLANES.find(p => p.id === record.selectedPlan)
    if (!plan) return []

    const createdDate = new Date(record.createdAt)
    let startMonth = createdDate.getMonth() + 1 // getMonth() returns 0-11
    let startYear = createdDate.getFullYear()

    // Si tiene deuda, empezar un mes antes e incrementar las cuotas en 1
    let totalInstallments = record.installments
    if (record.hasDebt) {
      startMonth -= 1
      if (startMonth === 0) {
        startMonth = 12
        startYear -= 1
      }
      totalInstallments += 1
    }

    const payments: PaymentPlan[] = []
    let currentMonth = startMonth
    let currentYear = startYear

    for (let i = 0; i < totalInstallments; i++) {
      // Si son 12 o más cuotas, las últimas 2 cuotas son bonificadas (valor 0)
      const isBonified = totalInstallments >= 12 && i >= totalInstallments - 2

      payments.push({
        month: currentMonth,
        year: currentYear,
        amount: isBonified ? 0 : plan.price
      })

      // Avanzar al siguiente mes
      currentMonth += 1
      if (currentMonth > 12) {
        currentMonth = 1
        currentYear += 1
      }
    }

    return payments
  }

  const payments = calculatePayments()
  const plan = PLANES.find(p => p.id === record.selectedPlan)
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalInstallments = record.hasDebt ? record.installments + 1 : record.installments

  const getMonthName = (month: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return months[month - 1]
  }

  const handleConfirm = () => {
    onConfirm(payments)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Confirmar Activación de Membresía</h3>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="member-info">
            <h4>{record.firstName} {record.lastName}</h4>
            <p><strong>Plan:</strong> {plan?.name}</p>
            <p><strong>Documento:</strong> {record.documentType} {record.documentNumber}</p>
            <p><strong>Cuotas:</strong> {totalInstallments}</p>
            {record.hasDebt && (
              <p className="debt-notice"><strong>⚠️ Tiene deuda:</strong> Se incluye cuota de reinscripción</p>
            )}
            {totalInstallments >= 12 && (
              <p className="bonification-notice"><strong>🎉 Descuento aplicado:</strong> Las últimas 2 cuotas están bonificadas</p>
            )}
          </div>

          <div className="payment-schedule">
            <h4>Plan de Pagos</h4>
            <div className="payments-list">
              {payments.map((payment, index) => (
                <div key={index} className={`payment-item ${payment.amount === 0 ? 'bonified' : ''}`}>
                  <span>{getMonthName(payment.month)} {payment.year}</span>
                  <span className={`amount ${payment.amount === 0 ? 'bonified-amount' : ''}`}>
                    {payment.amount === 0 ? 'BONIFICADO' : `$${payment.amount.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="total-payment">
              <strong>Total: ${totalAmount.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Activando...' : 'Confirmar Activación'}
          </button>
        </div>
      </div>
    </div>
  )
}