import { useState, useEffect } from 'react'
import { FormData } from '../types/FormData'
import { STEPS, PLANES } from '../types/constants'
import { useFormValidation } from '../hooks/useFormValidation'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'

// Components
import { ProgressBar } from './shared/ProgressBar'
import { Navigation } from './layout/Navigation'
import { PersonalDataStep } from './steps/PersonalDataStep'
import { ContactStep } from './steps/ContactStep'
import { MembershipStep } from './steps/MembershipStep'
import { PhotoStep } from './steps/PhotoStep'
import { PaymentStep } from './steps/PaymentStep'

// Screens
import { TransferScreen, ActivationScreen } from './screens'

import './RegistroSocios.css'

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showActivation, setShowActivation] = useState(false)
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

  // Custom hooks
  const { errors, validateStep, clearErrors } = useFormValidation()
  const { uploadToCloudinary, uploadProgress, isUploading } = useCloudinaryUpload()

  // iOS viewport fix for keyboard issues
  useEffect(() => {
    const handleResize = () => {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)

        setTimeout(() => {
          window.scrollTo(0, 0)
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
        }, 100)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
    // Clear errors when user starts typing
    clearErrors(Object.keys(data))
  }

  const calcularPrecioFinal = (): number => {
    const plan = PLANES.find(p => p.id === formData.planSeleccionado)
    if (!plan) return 0
    return formData.pagoAnual ? plan.precio * 10 : plan.precio
  }

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadToCloudinary(file)
      updateFormData({ fotoUrl: result.url })
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir la imagen. Por favor, inténtalo de nuevo.')
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      if (validateStep(currentStep, formData)) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      // Final step - show transfer screen
      setShowTransfer(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePayWithMercadoPago = () => {
    window.open('https://mpago.la/2B558cv', '_blank')
  }

  // Transfer screen
  if (showActivation) {
    return (
      <ActivationScreen
        onBack={() => setShowActivation(false)}
        onFinish={() => alert('¡Registro completado! Realizá la transferencia para activar tu membresía.')}
      />
    )
  }

  if (showTransfer) {
    return (
      <TransferScreen
        formData={formData}
        calcularPrecioFinal={calcularPrecioFinal}
        onPayWithMercadoPago={handlePayWithMercadoPago}
        onShowActivation={() => setShowActivation(true)}
      />
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDataStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )
      case 1:
        return (
          <ContactStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )
      case 2:
        return (
          <MembershipStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )
      case 3:
        return (
          <PhotoStep
            formData={formData}
            handleFileUpload={handleFileUpload}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
          />
        )
      case 4:
        return (
          <PaymentStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            calcularPrecioFinal={calcularPrecioFinal}
          />
        )
      default:
        return null
    }
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

      {/* Main Form Container */}
      <div className="form-container">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={STEPS.length}
          stepName={STEPS[currentStep]}
        />

        {renderStep()}

        <Navigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrevious={prevStep}
          onNext={nextStep}
        />
      </div>
    </div>
  )
}