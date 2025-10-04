import React, { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { GET_MEMBERS } from '../../services/queries'
import { MembersTable } from './MembersTable'
import { useAuth, useInstitution } from '../../contexts/AuthContext'
import { getInstitutionStyles, getInstitutionLogo } from '../../utils/institutionUtils'

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
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined)

  const { data, loading, error, refetch } = useQuery<GetMembersResponse>(GET_MEMBERS, {
    variables: {
      filters: {
        paymentYear: selectedYear,
        paymentMonth: selectedMonth
      }
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

  const institutionStyles = getInstitutionStyles(institution)
  const institutionLogo = getInstitutionLogo(institution)

  // Generate year options (current year and previous 5 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ]

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
            <button className="btn-secondary" onClick={() => navigate('/nuevos')}>
              Nuevos Registros
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="year">Año:</label>
          <select
            id="year"
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
            className="filter-select"
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
          >
            <option value="">Todos</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-clear-filters" onClick={handleClearFilters}>
          Limpiar filtros
        </button>

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
      />
    </div>
  )
}
