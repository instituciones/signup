import React, { useState, useEffect } from 'react'

interface Member {
  id: string
  firstName: string
  lastName: string
  memberNumber: string
  phoneArea: string
  phoneNumber: string
  email?: string
}

interface EditMemberModalProps {
  member: Member | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<Member>) => void
  isLoading?: boolean
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    memberNumber: '',
    firstName: '',
    lastName: '',
    phoneArea: '',
    phoneNumber: '',
    email: ''
  })

  useEffect(() => {
    if (member) {
      setFormData({
        memberNumber: member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        phoneArea: member.phoneArea,
        phoneNumber: member.phoneNumber,
        email: member.email || ''
      })
    }
  }, [member])

  if (!isOpen || !member) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Solo enviar los campos que han cambiado
    const updates: Partial<Member> = {}

    if (formData.memberNumber !== member.memberNumber) {
      updates.memberNumber = formData.memberNumber
    }
    if (formData.firstName !== member.firstName) {
      updates.firstName = formData.firstName
    }
    if (formData.lastName !== member.lastName) {
      updates.lastName = formData.lastName
    }
    if (formData.phoneArea !== member.phoneArea) {
      updates.phoneArea = formData.phoneArea
    }
    if (formData.phoneNumber !== member.phoneNumber) {
      updates.phoneNumber = formData.phoneNumber
    }
    if (formData.email !== (member.email || '')) {
      updates.email = formData.email
    }

    onSave(member.id, updates)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Editar Socio</h3>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="memberNumber">N° de Socio:</label>
              <input
                type="text"
                id="memberNumber"
                name="memberNumber"
                value={formData.memberNumber}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">Nombres:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Apellido:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneArea">Código de Área:</label>
              <input
                type="text"
                id="phoneArea"
                name="phoneArea"
                value={formData.phoneArea}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Teléfono:</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
