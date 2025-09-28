import { useState, useEffect } from 'react'
import { FormData } from '../types/FormData'
import { STEPS, PLANES } from '../types/constants'
import { useFormValidation } from '../hooks/useFormValidation'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'
import { useRegistrationSubmit } from '../hooks/useRegistrationSubmit'
import { useCreateProvisionalRecord } from '../hooks/useCreateProvisionalRecord'

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
  const [formData, setFormData] = useState<FormData>(() => {
    const initialData: FormData = {
      firstName: '',
      lastName: '',
      documentType: '',
      documentNumber: '',
      phoneArea: '264',
      phoneNumber: '',
      email: '',
      isMember: false,
      hasDebt: false,
      installments: 1,
      annualPayment: false,
      institutionId: '219f36ed-d8ac-4754-9384-d9f181dbfa94',
      status: 'pending' as 'pending'
    }
    console.log('🔥 INITIAL FORM DATA:', initialData)
    console.log('🔥 INITIAL installments:', initialData.installments, typeof initialData.installments)
    return initialData
  })

  // Custom hooks
  const { errors, validateStep, clearErrors } = useFormValidation()
  const { uploadToCloudinary, uploadProgress, isUploading } = useCloudinaryUpload()
  // const { isSubmitting, submitError, submitSuccess, submitRegistration } = useRegistrationSubmit()
  const { isCreating, createError, provisionalRecord, createProvisionalRecord } = useCreateProvisionalRecord()

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
    console.log('=== updateFormData called ===')
    console.log('Data recibida:', data)
    console.log('FormData actual antes del update:', formData)

    // Verificar específicamente installments
    if ('installments' in data) {
      console.log('🔍 INSTALLMENTS UPDATE:')
      console.log('  Valor anterior:', formData.installments, typeof formData.installments)
      console.log('  Valor nuevo:', data.installments, typeof data.installments)
      console.log('  Es NaN el nuevo valor?', isNaN(data.installments as number))
    }

    setFormData(prev => {
      const newFormData = { ...prev, ...data }
      console.log('FormData después del update:', newFormData)

      // Verificar installments después del update
      if ('installments' in data) {
        console.log('🔍 INSTALLMENTS DESPUÉS DEL UPDATE:')
        console.log('  newFormData.installments:', newFormData.installments, typeof newFormData.installments)
      }

      return newFormData
    })

    // Clear errors when user starts typing
    clearErrors(Object.keys(data))
  }

  const calcularPrecioFinal = (): number => {
    console.log('=== calcularPrecioFinal DEBUG ===')
    console.log('formData.selectedPlan:', formData.selectedPlan)
    console.log('formData.installments:', formData.installments, typeof formData.installments)
    console.log('formData.hasDebt:', formData.hasDebt, typeof formData.hasDebt)
    console.log('PLANES:', PLANES)

    const plan = PLANES.find(p => p.id === formData.selectedPlan)
    console.log('Plan encontrado:', plan)

    if (!plan) {
      console.log('No se encontró plan, retornando 0')
      return 0
    }

    // Validar que plan.price sea un número válido
    if (typeof plan.price !== 'number' || isNaN(plan.price)) {
      console.error('plan.price no es un número válido:', plan.price)
      return 0
    }

    // Validar que installments sea un número válido
    const installments = Number(formData.installments)
    if (isNaN(installments) || installments < 1) {
      console.error('installments no es válido:', formData.installments, 'convertido a:', installments)
      return 0
    }

    let total = 0

    // Calcular el total basado en la cantidad de cuotas
    if (installments === 12) {
      // 12 cuotas = 10 cuotas pagadas (descuento de 2 cuotas)
      total = plan.price * 10
      console.log('Cálculo 12 cuotas:', plan.price, '* 10 =', total)
    } else {
      // Para cualquier otra cantidad de cuotas, se paga el precio completo por cada cuota
      total = plan.price * installments
      console.log('Cálculo cuotas normales:', plan.price, '*', installments, '=', total)
    }

    // Si tiene deuda, agregar cuota de reinscripción
    if (formData.hasDebt === true) {
      total += plan.price
      console.log('Agregando cuota de reinscripción:', plan.price, 'Total con deuda:', total)
    }

    console.log('Total final:', total)
    console.log('=== FIN DEBUG ===')

    // Validar que el total sea un número válido antes de retornar
    if (isNaN(total) || !isFinite(total)) {
      console.error('Total calculado no es válido:', total)
      return 0
    }

    return total
  }

  // Wrapper seguro para usar en componentes
  const calcularPrecioFinalSeguro = (): number => {
    try {
      const precio = calcularPrecioFinal()
      return isNaN(precio) ? 0 : precio
    } catch (error) {
      console.error('Error en calcularPrecioFinal:', error)
      return 0
    }
  }

  const resetForm = () => {
    console.log('🔄 Reseteando formulario...')
    const freshFormData: FormData = {
      firstName: '',
      lastName: '',
      documentType: '',
      documentNumber: '',
      phoneArea: '264',
      phoneNumber: '',
      email: '',
      isMember: false,
      hasDebt: false,
      installments: 1,
      annualPayment: false,
      institutionId: '219f36ed-d8ac-4754-9384-d9f181dbfa94',
      status: 'pending' as 'pending'
    }
    setFormData(freshFormData)
    setCurrentStep(0)
    setShowTransfer(false)
    setShowActivation(false)
    console.log('✅ Formulario reseteado')
  }

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadToCloudinary(file)
      updateFormData({ photoUrl: result.url })
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir la imagen. Por favor, inténtalo de nuevo.')
    }
  }

  const nextStep = async () => {
    console.log('nextStep called, currentStep:', currentStep)
    console.log('Total steps:', STEPS.length)

    if (currentStep < STEPS.length - 1) {
      console.log('Validating step:', currentStep, 'with formData:', formData)
      const isValid = validateStep(currentStep, formData)
      console.log('Validation result:', isValid)

      if (isValid) {
        console.log('Validation passed, proceeding...')


        setCurrentStep(currentStep + 1)
      } else {
        console.log('Validation failed, errors:', errors)
      }
    } else {
      // Final step (step 4) - crear registro provisional y mostrar transfer screen
      console.log('En step final (4), creando registro provisional...')

      if (!formData.selectedPlan) {
        alert('Por favor, selecciona un plan antes de continuar.')
        return
      }

      console.log('Iniciando creación de registro provisional...')
      console.log('FormData completo:', formData)

      try {
        const result = await createProvisionalRecord(formData)
        console.log('Resultado de createProvisionalRecord:', result)

        if (!result.success) {
          alert(`Error al crear el registro: ${result.error}`)
          return
        }

        console.log('Registro provisional creado exitosamente:', result.record)

        // Show transfer screen después de crear el registro
        setShowTransfer(true)

      } catch (error) {
        console.error('Error en createProvisionalRecord:', error)
        alert('Error al crear el registro provisional. Por favor, inténtalo de nuevo.')
        return
      }
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

  const handleFormSubmit = async () => {
    try {
      // For now, just show transfer screen
      alert('¡Registro completado! Procede con el pago.')
      setShowTransfer(true)
    } catch (error) {
      alert('Error inesperado al enviar el registro. Por favor, inténtalo de nuevo.')
    }
  }

  // Transfer screen
  if (showActivation) {
    return (
      <ActivationScreen
        onBack={() => setShowActivation(false)}
        onFinish={() => {
          alert('¡Registro completado! Realizá la transferencia para activar tu membresía.')
          resetForm()
        }}
        onNewRegistration={resetForm}
      />
    )
  }

  if (showTransfer) {
    return (
      <TransferScreen
        formData={formData}
        calcularPrecioFinal={calcularPrecioFinalSeguro}
        onPayWithMercadoPago={handlePayWithMercadoPago}
        onShowActivation={() => setShowActivation(true)}
        onNewRegistration={resetForm}
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
            calcularPrecioFinal={calcularPrecioFinalSeguro}
            onFormSubmit={handleFormSubmit}
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
          isLoading={isCreating}
        />
      </div>
    </div>
  )
}