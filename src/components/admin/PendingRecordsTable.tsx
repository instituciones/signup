import React from 'react'
import { PLANES } from '../../types/constants'
import { ProvisionalRecord } from '../../types/graphql'

interface PendingRecordsTableProps {
  records: ProvisionalRecord[]
  loading?: boolean
  onActivate?: (record: ProvisionalRecord) => void
}

export const PendingRecordsTable: React.FC<PendingRecordsTableProps> = ({
  records,
  loading,
  onActivate
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const openWhatsApp = (phoneArea: string, phoneNumber: string) => {
    const fullNumber = `54${phoneArea}${phoneNumber}`
    const whatsappUrl = `https://wa.me/${fullNumber}`
    window.open(whatsappUrl, '_blank')
  }

  const getPlanName = (planId?: string) => {
    if (!planId) return '-'
    const plan = PLANES.find(p => p.id === planId)
    return plan ? plan.name : planId
  }

  if (loading) {
    return (
      <div className="table-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Cargando registros...
        </div>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="table-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          No hay registros pendientes
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="records-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Cuotas</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  <div className="name-cell">
                    {record.firstName} {record.lastName}
                    {record.hasDebt && <span className="debt-badge">Con deuda</span>}
                    {record.isMember && <span className="member-badge">Socio #{record.memberNumber}</span>}
                  </div>
                </td>
                <td>{record.documentType} {record.documentNumber}</td>
                <td>
                  <div className="phone-cell">
                    <div>{record.phoneArea} {record.phoneNumber}</div>
                    <button
                      className="whatsapp-btn"
                      onClick={() => openWhatsApp(record.phoneArea, record.phoneNumber)}
                      title="Abrir WhatsApp"
                    >
                      💬 WhatsApp
                    </button>
                  </div>
                </td>
                <td>{record.email}</td>
                <td>{getPlanName(record.selectedPlan)}</td>
                <td>
                  {record.installments} cuota{record.installments > 1 ? 's' : ''}
                  {record.annualPayment && <span className="annual-badge">Anual</span>}
                </td>
                <td>
                  <span className={`status-badge status-${record.status}`}>
                    {record.status}
                  </span>
                </td>
                <td>{formatDate(record.createdAt)}</td>
                <td>
                  <button
                    className="btn-activate"
                    onClick={() => onActivate?.(record)}
                    disabled={!onActivate || record.status !== 'pending'}
                  >
                    {record.status === 'pending' ? 'Activar' : 'Activado'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}