import React from 'react'
import { FormData } from '../../types/FormData'
import { PLANES } from '../../types/constants'

interface TransferScreenProps {
  formData: FormData
  calcularPrecioFinal: () => number
  onPayWithMercadoPago: () => void
  onShowActivation: () => void
}

export const TransferScreen: React.FC<TransferScreenProps> = ({
  formData,
  calcularPrecioFinal,
  onPayWithMercadoPago,
  onShowActivation
}) => {
  return (
    <div className="registro-container">
      <div className="transfer-screen">
        <h2>¡Completa tu Pago!</h2>

        <div className="instructions">
          <div className="payment-methods">
            <div className="method-option">
              <h5>💳 Opción 1: Pago Directo</h5>
              <div className="mercadopago-button-container">
                <button
                  className="btn-mercadopago"
                  onClick={onPayWithMercadoPago}
                >
                  💳 Pagar con MercadoPago
                </button>
              </div>
            </div>
            <div className="method-option">
              <h5>🔄 Opción 2: Transferencia Manual</h5>
              <ol>
                <li>🔵 Abrí MercadoPago en tu celular</li>
                <li>💸 Seleccioná "Transferir dinero"</li>
                <li>🎯 Ingresá el alias: <strong>clubalianza.mp</strong></li>
                <li>💰 Transferí: <strong>${calcularPrecioFinal().toLocaleString()}</strong></li>
                <li>✍️ En concepto escribí: "{formData.nombre} {formData.apellido} - {PLANES.find(p => p.id === formData.planSeleccionado)?.nombre}"</li>
              </ol>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onShowActivation}>
          📋 Ver instrucciones de activación
        </button>
      </div>
    </div>
  )
}