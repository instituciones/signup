import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PENDING_PROVISIONAL_RECORDS } from '../../services/queries'
import { CREATE_MEMBER_PAYMENT, CREATE_MEMBER } from '../../graphql/mutations'
import { GetPendingProvisionalRecordsResponse, ProvisionalRecord } from '../../types/graphql'
import { CreateMemberPaymentInput, CreateMemberInput, CreateMemberResponse } from '../../graphql/mutations'
import { PendingRecordsTable } from './PendingRecordsTable'
import { ActivationModal } from './ActivationModal'

export const NuevosPage: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<ProvisionalRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, loading, error, refetch } = useQuery<GetPendingProvisionalRecordsResponse>(GET_PENDING_PROVISIONAL_RECORDS)

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
        document_id: selectedRecord.documentNumber,
        document_type: selectedRecord.documentType,
        institutionId: '219f36ed-d8ac-4754-9384-d9f181dbfa94'
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
          institutionId: '219f36ed-d8ac-4754-9384-d9f181dbfa94',
          year: payments[0].year,
          month: payments[0].month,
          amount: payments[0].amount,
          status: 'pending',
          installments: selectedRecord.installments
        }

        await createMemberPayment({
          variables: { input: paymentInput }
        })
      }
    } catch (error) {
      console.error('Error in handleConfirmActivation:', error)
    }
  }

  return (
    <div className="nuevos-page">
      <div className="page-header">
        <h1>Registros Nuevos</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Actualizando...' : '🔄 Actualizar'}
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