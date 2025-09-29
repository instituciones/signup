import React from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  fullWidth?: boolean
  children: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  fullWidth = false,
  children
}) => {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label>
        {label} {required && '*'}
      </label>
      {children}
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

interface FormInputProps {
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
}

export const FormInput: React.FC<FormInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = false
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`form-input ${error ? 'error' : ''}`}
    />
  )
}

interface FormSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
  placeholder?: string
  error?: boolean
}

export const FormSelect: React.FC<FormSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccione una opción',
  error = false
}) => {
  // Validar que el valor actual existe en las opciones
  const normalizedValue = options.find(opt => opt.value === value) ? value : ''

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    console.log('FormSelect onChange - newValue:', newValue, 'type:', typeof newValue)

    // Validación adicional para Android
    if (newValue !== undefined && newValue !== null) {
      onChange(newValue)
    }
  }

  return (
    <select
      value={normalizedValue}
      onChange={handleChange}
      className={`form-select ${error ? 'error' : ''}`}
      // Forzar re-render con key basado en valor
      key={`select-${normalizedValue}-${options.length}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}