import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { GET_MEMBERS } from '../../services/queries'
import { UPDATE_MEMBER } from '../../graphql/mutations'
import { MembersTable } from './MembersTable'
import { EditMemberModal } from './EditMemberModal'
import { useAuth, useInstitution } from '../../contexts/AuthContext'
import { getInstitutionStyles, getInstitutionLogo } from '../../utils/institutionUtils'
import { MONTHS } from '../../types/constants'

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

interface Payment {
  year: number
  month: number
  amount: number
  status: string
}

interface GetMembersResponse {
  members: Member[]
}

export const ActiveMembersPage: React.FC = () => {
  const { user } = useAuth()
  const institution = useInstitution()
  const navigate = useNavigate()

  // Usar la fecha del servidor (fecha actual)
  const currentDate = new Date()
  const [selectedYear, setSelectedYear] = useState<number | undefined>(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(currentDate.getMonth() + 1)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, loading, error, refetch } = useQuery<GetMembersResponse>(GET_MEMBERS, {
    variables: {
      filters: {
        paymentYear: selectedYear,
        paymentMonth: selectedMonth
      }
    }
  })

  const [updateMember, { loading: updateLoading }] = useMutation(UPDATE_MEMBER, {
    onCompleted: () => {
      setIsModalOpen(false)
      setSelectedMember(null)
      refetch()
    },
    onError: (error) => {
      console.error('Error updating member:', error)
      alert('Error al actualizar el socio: ' + error.message)
    }
  })

  const handleRefresh = () => {
    refetch()
  }

  const handlePrint = () => {
    const printContent = document.querySelector('.table-container')
    if (!printContent) return

    const originalContents = document.body.innerHTML
    const printContents = printContent.innerHTML

    document.body.innerHTML = `
      <html>
        <head>
          <title>Miembros Activos - ${institution?.name || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `

    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  const handleClearFilters = () => {
    setSelectedYear(undefined)
    setSelectedMonth(undefined)
  }

  const handleEditMember = (member: Member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  const handleSaveMember = (id: string, updates: Partial<Member>) => {
    updateMember({
      variables: {
        id,
        input: updates
      }
    })
  }

  const institutionStyles = getInstitutionStyles(institution)
  const institutionLogo = getInstitutionLogo(institution)

  // Generate year options (current year and previous 5 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

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
            <h1>Miembros Activos - {institution?.name}</h1>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Actualizando...' : '🔄 Actualizar'}
          </button>
          {user && (
            <>
              <button className="btn-secondary" onClick={() => navigate('/nuevos')}>
                Nuevos Registros
              </button>
              <button className="btn-secondary" onClick={() => navigate('/pagos-miembros')}>
                Registrar Pagos
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        {/* <div className="filter-group">
          <label htmlFor="year">Año:</label>
          <select
            id="year"
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
            className="filter-select"
            disabled
          >
            <option value="">Todos</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="month">Mes:</label>
          <select
            id="month"
            value={selectedMonth || ''}
            onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : undefined)}
            className="filter-select"
            disabled
          >
            <option value="">Todos</option>
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-clear-filters" onClick={handleClearFilters} disabled>
          Limpiar filtros
        </button> */}

        <button className="btn-print" onClick={handlePrint}>
          🖨️ Imprimir
        </button>
      </div>

      {error && (
        <div className="error-message">
          Error al cargar socios: {error.message}
        </div>
      )}

      <MembersTable
        members={data?.members || []}
        loading={loading}
        isLoggedIn={!!user}
        onEditMember={user ? handleEditMember : undefined}
      />

      <EditMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMember}
        isLoading={updateLoading}
      />
    </div>
  )
}
