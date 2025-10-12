import React from 'react'

interface Payment {
  year: number
  month: number
  amount: number
  status: string
}

interface Member {
  id: string
  firstName: string
  lastName: string
  memberNumber: string
  documentId: string
  documentType: string
  phoneArea: string
  phoneNumber: string
  email?: string
  user?: {
    email: string
  } | null
  payments: Payment[]
  createdAt: string
  updatedAt: string
}

interface MembersTableProps {
  members: Member[]
  loading?: boolean
  isLoggedIn?: boolean
  onEditMember?: (member: Member) => void
}

export const MembersTable: React.FC<MembersTableProps> = ({ members, loading, isLoggedIn = false, onEditMember }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const openWhatsApp = (phoneArea: string, phoneNumber: string) => {
    const fullNumber = `54${phoneArea}${phoneNumber}`
    const whatsappUrl = `https://wa.me/${fullNumber}`
    window.open(whatsappUrl, '_blank')
  }

  const getLastPayment = (payments: Payment[]) => {
    if (!payments || payments.length === 0) return null

    // Sort by year and month descending
    const sorted = [...payments].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })

    return sorted[0]
  }

  const getMonthName = (month: number) => {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ]
    return months[month - 1] || '-'
  }

  if (loading) {
    return (
      <div className="table-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Cargando socios...
        </div>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="table-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          No se encontraron socios
        </div>
      </div>
    )
  }

  // Sort members by lastName
  const sortedMembers = [...members].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  )

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="records-table">
          <thead>
            <tr>
              <th>#</th>
              <th>N° Socio</th>
              <th>Apellido y Nombre</th>
              <th>User</th>
              <th>Documento</th>
              <th>Teléfono</th>
              {isLoggedIn && <th>Último Pago</th>}
              {isLoggedIn && <th>Fecha Alta</th>}
              {isLoggedIn && onEditMember && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map((member, index) => {
              const lastPayment = getLastPayment(member.payments)

              return (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.memberNumber}</td>
                  <td>
                    <div className="name-cell">
                      {member.lastName}, {member.firstName}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {member.user !== null && member.user !== undefined ? '✓' : ''}
                  </td>
                  <td>{member.documentId}</td>
                  <td>{member.phoneArea} {member.phoneNumber}</td>
                  {isLoggedIn && (
                    <td>
                      {lastPayment ? (
                        <span>
                          {getMonthName(lastPayment.month)} {lastPayment.year}
                        </span>
                      ) : (
                        <span>Sin pagos</span>
                      )}
                    </td>
                  )}
                  {isLoggedIn && <td>{formatDate(member.createdAt)}</td>}
                  {isLoggedIn && onEditMember && (
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => onEditMember(member)}
                        title="Editar socio"
                      >
                        ✏️
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
