import React from 'react'

interface ActivationScreenProps {
  onBack: () => void
  onFinish: () => void
  onNewRegistration?: () => void
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({
  onBack,
  onFinish,
  onNewRegistration
}) => {
  return (
    <div className="registro-container">
      <div className="transfer-screen">
        <h2>📋 Instrucciones de Activación</h2>

        <div className="important-note">
          <h4>⚠️ Para activar tu membresía:</h4>
          <p>• Envía el comprobante por WhatsApp:</p>
          <div className="phone-numbers">
            <a href="https://wa.me/542646737411" target="_blank" rel="noopener noreferrer">📱 264-673-7411</a>
            <a href="https://wa.me/542644177806" target="_blank" rel="noopener noreferrer">📱 264-417-7806</a>
            <a href="https://wa.me/542644889141" target="_blank" rel="noopener noreferrer">📱 264-488-9141</a>
          </div>
          <p>• Una vez confirmado el pago nos contactaremos contigo brindandote un numero de socio, y pronto una aplicacion donde podras ver todos los beneficios y tus ingresos bonificadoos al club.</p>
        </div>

        <div className="navigation">
          <button className="btn-secondary" onClick={onBack}>
            ← Volver al pago
          </button>
          <button className="btn-primary" onClick={onFinish}>
            ✅ Finalizar
          </button>
        </div>

        {onNewRegistration && (
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button
              className="btn-secondary"
              onClick={onNewRegistration}
              style={{ width: '100%' }}
            >
              📝 Nuevo Registro
            </button>
          </div>
        )}
      </div>
    </div>
  )
}