import { useState, useEffect } from 'react'
import './RegistroSocios.css'

export interface FormData {
  nombre: string
  apellido: string
  tipoDocumento: string
  documento: string
  codigoArea: string
  telefono: string
  email: string
  esSocio: boolean
  numeroSocio?: string
  foto?: File
  fotoUrl?: string
  planSeleccionado?: string
  pagoAnual: boolean
}

const STEPS = [
  'Datos Personales',
  'Contacto',
  'Estado de Socio',
  'Cargar Foto',
  'Opciones de Pago'
]

const PLANES = [
  { id: 'popular', nombre: 'Popular', precio: 12000 },
  { id: 'platea', nombre: 'Platea', precio: 15000 },
  { id: 'jugador', nombre: 'Jugador o Padre/Tutor', precio: 10000 },
  { id: 'jubilado', nombre: 'Jubilado', precio: 10000 },
  { id: 'juvenil', nombre: 'Juvenil', precio: 10000 }
]

export default function RegistroSociosSimple() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showActivation, setShowActivation] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    documento: '',
    codigoArea: '264',
    telefono: '',
    email: '',
    esSocio: false,
    pagoAnual: false
  })

  // iOS viewport fix for keyboard issues
  useEffect(() => {
    const handleResize = () => {
      // Force recalculation of viewport height on iOS
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)

        // Additional fix for iOS Chrome
        setTimeout(() => {
          window.scrollTo(0, 0)
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
        }, 100)
      }
    }

    // Set initial viewport height
    handleResize()

    // Listen for viewport changes
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors) {
      const newErrors = { ...errors }
      Object.keys(data).forEach(key => {
        delete newErrors[key]
      })
      setErrors(newErrors)
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0:
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido'
        if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Seleccione un tipo de documento'
        if (!formData.documento.trim()) newErrors.documento = 'El número de documento es requerido'
        else if (!/^\d+$/.test(formData.documento)) newErrors.documento = 'Solo se permiten números'
        break

      case 1:
        if (!formData.codigoArea.trim()) newErrors.codigoArea = 'El código de área es requerido'
        else if (!/^\d{2,4}$/.test(formData.codigoArea)) newErrors.codigoArea = 'Código de área inválido'
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido'
        else if (!/^[\d\-\s]+$/.test(formData.telefono)) newErrors.telefono = 'Formato de teléfono inválido'
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
        break

      case 2:
        // Número de socio es opcional
        break

      case 4:
        if (!formData.planSeleccionado) newErrors.planSeleccionado = 'Debe seleccionar un plan'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowTransfer(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({}) // Limpiar errores al retroceder
    }
  }

  const calcularPrecioFinal = () => {
    const plan = PLANES.find(p => p.id === formData.planSeleccionado)
    if (!plan) return 0
    return formData.pagoAnual ? plan.precio * 10 : plan.precio
  }

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'profile') // Usar preset profile
      formData.append('folder', 'atleticoalianza')

      const xhr = new XMLHttpRequest()

      return new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100
            setUploadProgress(progress)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            setUploadProgress(100)
            setTimeout(() => {
              setIsUploading(false)
              setUploadProgress(0)
            }, 500)
            // Crear URL con transformaciones para thumbnail
            const transformedUrl = response.secure_url.replace('/upload/', '/upload/c_thumb,g_face,h_300,w_300/')
            resolve(transformedUrl)
          } else {
            reject(new Error('Upload failed'))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'))
        })

        xhr.open('POST', 'https://api.cloudinary.com/v1_1/sanjua/image/upload')
        xhr.send(formData)
      })
    } catch (error) {
      setIsUploading(false)
      setUploadProgress(0)
      throw error
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const uploadedUrl = await uploadToCloudinary(file)
      updateFormData({
        foto: file,
        fotoUrl: uploadedUrl
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir la imagen. Por favor, intenta nuevamente.')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => updateFormData({ nombre: e.target.value })}
                placeholder="Nombre"
                className={`form-input ${errors.nombre ? 'error' : ''}`}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>
            <div className="form-group">
              <label>Apellido *</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => updateFormData({ apellido: e.target.value })}
                placeholder="Apellido"
                className={`form-input ${errors.apellido ? 'error' : ''}`}
              />
              {errors.apellido && <span className="error-message">{errors.apellido}</span>}
            </div>
            <div className="form-group">
              <label>Tipo de Documento *</label>
              <select
                value={formData.tipoDocumento}
                onChange={(e) => updateFormData({ tipoDocumento: e.target.value })}
                className={`form-select ${errors.tipoDocumento ? 'error' : ''}`}
              >
                <option value="">Seleccione</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="CUIT">CUIT</option>
                <option value="CUIL">CUIL</option>
              </select>
              {errors.tipoDocumento && <span className="error-message">{errors.tipoDocumento}</span>}
            </div>
            <div className="form-group">
              <label>Nro de Documento *</label>
              <input
                type="text"
                value={formData.documento}
                onChange={(e) => updateFormData({ documento: e.target.value })}
                placeholder="Número"
                className={`form-input ${errors.documento ? 'error' : ''}`}
              />
              {errors.documento && <span className="error-message">{errors.documento}</span>}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <label>Código de Área *</label>
                <input
                  type="text"
                  value={formData.codigoArea}
                  onChange={(e) => updateFormData({ codigoArea: e.target.value })}
                  placeholder="011"
                  maxLength={4}
                  className={`form-input ${errors.codigoArea ? 'error' : ''}`}
                />
                {errors.codigoArea && <span className="error-message">{errors.codigoArea}</span>}
              </div>
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => updateFormData({ telefono: e.target.value })}
                  placeholder="15-1234-5678"
                  className={`form-input ${errors.telefono ? 'error' : ''}`}
                />
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
        )

      case 2:
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
                <div className="form-group">
                  <label>Número de Socio</label>
                  <input
                    type="text"
                    value={formData.numeroSocio || ''}
                    onChange={(e) => updateFormData({ numeroSocio: e.target.value })}
                    placeholder="Número de socio"
                    className={`form-input ${errors.numeroSocio ? 'error' : ''}`}
                  />
                  {errors.numeroSocio && <span className="error-message">{errors.numeroSocio}</span>}
                </div>
                <div className="amnesty-message">
                  <h4>🎉 ¡Amnistía Especial!</h4>
                  <p>
                    <strong>¡Buenas noticias!</strong> Reintegrate al padrón abonando solo <strong>una cuota adicional</strong> junto con tu inscripción.
                  </p>
                </div>
              </>
            )}
          </div>
        )

      case 3:
        return (
          <div className="step-content">
            <div className="form-group full-width">
              <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="file-input"
                id="foto-upload"
                disabled={isUploading}
              />
              <label htmlFor="foto-upload" className="upload-button">
                {isUploading ? 'Subiendo...' : formData.fotoUrl ? '✓ Foto cargada' : 'Seleccionar Foto'}
              </label>

              {isUploading && (
                <div className="upload-progress">
                  <div
                    className="upload-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {formData.fotoUrl && (
                <img
                  src={formData.fotoUrl}
                  alt="Foto de perfil"
                  className="uploaded-image"
                />
              )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Plan *</label>
              <select
                value={formData.planSeleccionado || ''}
                onChange={(e) => updateFormData({ planSeleccionado: e.target.value })}
                className={`form-select ${errors.planSeleccionado ? 'error' : ''}`}
              >
                <option value="">Seleccione un plan</option>
                {PLANES.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - ${plan.precio.toLocaleString()}
                  </option>
                ))}
              </select>
              {errors.planSeleccionado && <span className="error-message">{errors.planSeleccionado}</span>}
            </div>

            <div className="pago-anual">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.pagoAnual}
                    onChange={(e) => updateFormData({ pagoAnual: e.target.checked })}
                  />
                  Pago Anual (ahorro 2 cuotas)
                </label>
              </div>
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
                  <p className="ahorro">¡Ahorrás ${(PLANES.find(p => p.id === formData.planSeleccionado)?.precio || 0) * 2}!</p>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const handlePayWithMercadoPago = () => {
    // Usar el link directo de pago de MercadoPago
    window.open('https://mpago.la/2B558cv', '_blank')
  }

  if (showActivation) {
    return (
      <div className="registro-container">
        <div className="transfer-screen">
          <h2>📋 Instrucciones de Activación</h2>

          <div className="important-note">
            <h4>⚠️ Para activar tu membresía:</h4>
            <p>• Realiza la transferencia</p>
            <p>• Envía el comprobante por WhatsApp:</p>
            <div className="phone-numbers">
              <a href="https://wa.me/542646737411" target="_blank" rel="noopener noreferrer">📱 264-673-7411</a>
              <a href="https://wa.me/542644177806" target="_blank" rel="noopener noreferrer">📱 264-417-7806</a>
              <a href="https://wa.me/542644889141" target="_blank" rel="noopener noreferrer">📱 264-488-9141</a>
            </div>
            <p>• Tu membresía será activada una vez confirmado el pago</p>
          </div>

          <div className="navigation">
            <button className="btn-secondary" onClick={() => setShowActivation(false)}>
              ← Volver al pago
            </button>
            <button className="btn-primary" onClick={() => alert('¡Registro completado! Realizá la transferencia para activar tu membresía.')}>
              ✅ Finalizar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showTransfer) {
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
                    onClick={handlePayWithMercadoPago}
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


          <button
            className="btn-primary"
            onClick={() => {
              console.log('Clicked activation button');
              setShowActivation(true);
            }}
          >
            📋 Ver instrucciones de activación
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="registro-container">
      {/* Header del Club */}
      <div className="club-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Escudo-01.png"
          alt="Escudo Club Atlético de la Juventud Alianza"
          className="club-shield-img"
        />
        <h1>Registro de Socios</h1>
        <p className="club-subtitle">Registro de Socios</p>
      </div>

      {/* Contenedor Principal del Formulario */}
      <div className="form-container">
        <div className="progress-bar">
          <div className="progress-info">
            Paso {currentStep + 1} de {STEPS.length}: {STEPS[currentStep]}
          </div>
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="navigation">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="btn-secondary"
            >
              Anterior
            </button>
          )}
          <button
            onClick={nextStep}
            className="btn-primary"
            style={currentStep === 0 ? { width: '100%' } : {}}
          >
            {currentStep === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}