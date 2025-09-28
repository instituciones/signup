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
              <h5>💳 Registro guardado</h5>
              <div className="mercadopago-button-container">
                <p>Tus datos fueron guardados, quedamos a la espera de tu transferencia para completar el proceso.</p>
              </div>
            </div>
            <div className="method-option">
              <h5>🔄 Transferencia</h5>
              <ol>
                <li>🔵 Abrí tu cuenta en tu celular</li>
                <li>💸 Seleccioná "Transferir dinero"</li>
                <li>🎯 Ingresá el alias: <strong>clubalianza.mp</strong></li>
                <li>💰 Transferí: <strong>${calcularPrecioFinal().toLocaleString()}</strong></li>
                <li>✍️ En concepto escribí: "{formData.firstName} {formData.lastName} - {PLANES.find(p => p.id === formData.selectedPlan)?.name}"</li>
              </ol>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onShowActivation}>
          📋 Ya pagué (instrucciones de activación)
        </button>
      </div>
    </div>
  )
}