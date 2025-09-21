import React from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepName: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepName
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="progress-bar">
      <div className="progress-info">
        Paso {currentStep + 1} de {totalSteps}: {stepName}
      </div>
      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}