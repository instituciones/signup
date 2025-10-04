import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { GET_PENDING_PROVISIONAL_RECORDS } from '../../services/queries'
import { CREATE_MEMBER_PAYMENT, CREATE_MEMBER } from '../../graphql/mutations'
import { GetPendingProvisionalRecordsResponse, ProvisionalRecord } from '../../types/graphql'
import { CreateMemberPaymentInput, CreateMemberInput, CreateMemberResponse } from '../../graphql/mutations'
import { PendingRecordsTable } from './PendingRecordsTable'
import { ActivationModal } from './ActivationModal'
import { useAuth, useInstitution } from '../../contexts/AuthContext'
import { getInstitutionStyles, getInstitutionLogo } from '../../utils/institutionUtils'

export const NuevosPage: React.FC = () => {
  const { user, logout } = useAuth()
  const institution = useInstitution()
  const navigate = useNavigate()
  const [selectedRecord, setSelectedRecord] = useState<ProvisionalRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('pending')

  const { data, loading, error, refetch } = useQuery<GetPendingProvisionalRecordsResponse>(GET_PENDING_PROVISIONAL_RECORDS, {
    variables: { status: statusFilter }
  })

  const [createMember, { loading: isCreatingMember }] = useMutation<CreateMemberResponse, { input: CreateMemberInput }>(CREATE_MEMBER, {
    onError: (error) => {
      console.error('Error creating member:', error)
      alert(`Error al crear miembro: ${error.message}`)
    }
  })

  const [createMemberPayment, { loading: isCreatingPayment }] = useMutation(CREATE_MEMBER_PAYMENT, {
    onCompleted: () => {
      setIsModalOpen(false)
      setSelectedRecord(null)
      refetch() // Refrescar la lista después de activar
      alert('¡Membresía activada exitosamente!')
    },
    onError: (error) => {
      console.error('Error creating member payment:', error)
      alert(`Error al activar membresía: ${error.message}`)
    }
  })

  const handleRefresh = () => {
    refetch()
  }

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value)
  }

  const handleActivate = (record: ProvisionalRecord) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRecord(null)
  }

  const handleConfirmActivation = async (payments: any[]) => {
    if (!selectedRecord) return

    try {
      // Primero crear el member
      const memberInput: CreateMemberInput = {
        firstName: selectedRecord.firstName,
        lastName: selectedRecord.lastName,
        phoneArea: selectedRecord.phoneArea,
        phoneNumber: selectedRecord.phoneNumber,
        documentId: selectedRecord.documentNumber,
        documentType: selectedRecord.documentType
      }

      const memberResult = await createMember({
        variables: { input: memberInput }
      })

      // Si el member se creó exitosamente, usar su ID para crear el payment
      if (memberResult.data?.createMember?.id) {
        const memberId = memberResult.data.createMember.id

        // Enviamos el primer pago y la cantidad de installments
        // El backend manejará la lógica de crear múltiples pagos
        const paymentInput: CreateMemberPaymentInput = {
          memberId: memberId, // Usar el ID del member recién creado
          year: payments[0].year,
          month: payments[0].month,
          amount: payments[0].amount,
          status: 'pending',
          installments: selectedRecord.hasDebt ?
            selectedRecord.installments + 1 :
            selectedRecord.installments,
          id: selectedRecord.id
        }

        await createMemberPayment({
          variables: { input: paymentInput }
        })
      }
    } catch (error) {
      console.error('Error in handleConfirmActivation:', error)
    }
  }

  // Aplicar colores de la institución como CSS custom properties
  const institutionStyles = getInstitutionStyles(institution)
  const institutionLogo = getInstitutionLogo(institution)

  return (
    <div className="nuevos-page" style={institutionStyles}>
      <div className="page-header">
        <div className="header-title">
          <div className="title-with-logo">
            {institutionLogo && (
              <img
                src={institutionLogo}
                alt={`Logo de ${institution?.name}`}
                className="institution-logo"
              />
            )}
            <h1>Registros Nuevos - {institution?.name}</h1>
          </div>
          <p className="user-info">Bienvenido, {user?.email}</p>
        </div>
        <div className="header-actions">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="status-filter-select"
            disabled={loading}
          >
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
          </select>
          <button className="btn-secondary" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Actualizando...' : '🔄 Actualizar'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/activos')}>
            Miembros Activos
          </button>
          <button className="btn-logout" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          Error al cargar registros: {error.message}
        </div>
      )}

      <PendingRecordsTable
        records={data?.pendingProvisionalRecords || []}
        loading={loading}
        onActivate={handleActivate}
      />

      {selectedRecord && (
        <ActivationModal
          record={selectedRecord}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmActivation}
          isLoading={isCreatingMember || isCreatingPayment}
        />
      )}
    </div>
  )
}