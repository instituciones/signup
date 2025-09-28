import React from 'react'

interface NavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  isLoading?: boolean
}

export const Navigation: React.FC<NavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLoading = false
}) => {
  return (
    <div className="navigation">
      {currentStep > 0 && (
        <button
          onClick={onPrevious}
          className="btn-secondary"
        >
          Anterior
        </button>
      )}
      <button
        onClick={onNext}
        className="btn-primary"
        style={currentStep === 0 ? { width: '100%' } : {}}
        disabled={isLoading}
      >
        {isLoading ? 'Procesando...' : (currentStep === totalSteps - 1 ? 'Finalizar' : 'Siguiente')}
      </button>
    </div>
  )
}