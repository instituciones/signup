import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { GET_MEMBER_TYPES, GET_MEMBER_BY_DNI, GET_INSTITUTION_PAYMENT_METHODS } from '../../services/queries'
import { CREATE_MEMBER_PAYMENT_BY_ID, CreateMemberPaymentByIdInput, CreateMemberPaymentByIdResponse } from '../../graphql/mutations'
import { useAuth, useInstitution } from '../../contexts/AuthContext'
import { getInstitutionStyles, getInstitutionLogo } from '../../utils/institutionUtils'
import { MONTHS } from '../../types/constants'
import { MemberAutocomplete } from './MemberAutocomplete'

interface MemberType {
  id: string
  name: string
  price: number
  description?: string
}

interface GetMemberTypesResponse {
  memberTypes: MemberType[]
}

interface PaymentMethod {
  id: string
  name: string
}

interface InstitutionPaymentMethod {
  id: string
  paymentMethod: PaymentMethod
}

interface GetInstitutionPaymentMethodsResponse {
  institutionPaymentMethods: InstitutionPaymentMethod[]
}

interface MonthPaymentWithBonification {
  month: number
  year: number
  amount: number
  bonificado?: boolean
}

interface FormValues {
  paymentMethodId: string
  months: MonthPaymentWithBonification[]
}

interface MemberByDniResponse {
  memberByDni: {
    id: string
    firstName: string
    lastName: string
    documentId: string
    documentType: string
    phoneArea: string
    phoneNumber: string
    photoUrl?: string
    memberNumber?: string
    birthday?: string
    memberType: {
      id: string
      name: string
      description?: string
      price: number
    }
    user?: {
      id: string
      email: string
      active: boolean
    }
  }
}

interface MemberFromAutocomplete {
  id: string
  firstName: string
  lastName: string
  memberNumber: string
  documentId: string
  documentType: string
  phoneArea: string
  phoneNumber: string
  user?: {
    email: string
  } | null
  memberType?: {
    id: string
    name: string
    price: number
  }
}

export const MemberPaymentsPage: React.FC = () => {
  const { user } = useAuth()
  const institution = useInstitution()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dniParam = searchParams.get('dni')

  const [currentMember, setCurrentMember] = useState<MemberFromAutocomplete | null>(null)

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 7 }, (_, i) => 2024 + i) // 2024 a 2030

  const { loading: loadingTypes } = useQuery<GetMemberTypesResponse>(GET_MEMBER_TYPES)

  const { data: paymentMethodsData, loading: loadingPaymentMethods } = useQuery<GetInstitutionPaymentMethodsResponse>(
    GET_INSTITUTION_PAYMENT_METHODS
  )

  const { data: memberData, loading: loadingMember } = useQuery<MemberByDniResponse>(GET_MEMBER_BY_DNI, {
    variables: {
      documentId: dniParam || '',
      documentType: 'dni'
    },
    skip: !dniParam
  })

  const [createMemberPayment, { loading: insertLoading }] = useMutation<CreateMemberPaymentByIdResponse, { input: CreateMemberPaymentByIdInput }>(
    CREATE_MEMBER_PAYMENT_BY_ID,
    {
      onCompleted: (data) => {
        alert(`Pagos creados exitosamente (${data.createMemberPaymentById.length} meses)`)
        navigate('/activos')
      },
      onError: (error) => {
        console.error('Error creating payments:', error)
        alert('Error al crear los pagos: ' + error.message)
      }
    }
  )

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      paymentMethodId: '',
      months: [
        {
          month: new Date().getMonth() + 1,
          year: currentYear,
          amount: 0,
          bonificado: false
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'months'
  })


  const onSubmit = (data: FormValues) => {
    // Priorizar currentMember sobre memberData
    const member = currentMember || memberData?.memberByDni

    if (!member?.id) {
      alert('No se ha seleccionado un miembro')
      return
    }

    // Obtener el precio del memberType del miembro
    const memberTypePrice = member.memberType?.price || 0

    if (!memberTypePrice) {
      alert('El miembro no tiene un tipo de membresía asignado')
      return
    }

    // Calcular el amount de cada mes basado en si está bonificado o no
    const monthsWithAmounts = data.months.map(month => ({
      month: month.month,
      year: month.year,
      amount: month.bonificado ? 0 : memberTypePrice
    }))

    createMemberPayment({
      variables: {
        input: {
          memberId: member.id,
          paymentMethodId: data.paymentMethodId,
          months: monthsWithAmounts
        }
      }
    })
  }

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
            <h1>Registrar Pagos de Miembro - {institution?.name}</h1>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/activos')}>
            Volver a Miembros Activos
          </button>
        </div>
      </div>

      <div className="member-payment-container">
        {/* Autocomplete Search */}
        <div className="search-section">
          <h3>Buscar Miembro</h3>
          <MemberAutocomplete
            onSelect={setCurrentMember}
            selectedMember={currentMember}
            placeholder="Buscar por nombre, apellido o DNI..."
          />
        </div>

        {/* Display selected member info */}
        {currentMember && (
          <div className="member-info-card">
            <h3>Miembro Seleccionado</h3>
            <div className="member-info-grid">
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{currentMember.firstName} {currentMember.lastName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">DNI:</span>
                <span className="info-value">{currentMember.documentId}</span>
              </div>
              {currentMember.memberNumber && (
                <div className="info-item">
                  <span className="info-label">Número de Socio:</span>
                  <span className="info-value">#{currentMember.memberNumber}</span>
                </div>
              )}
              {currentMember.memberType && (
                <div className="info-item">
                  <span className="info-label">Tipo de Miembro:</span>
                  <span className="info-value">{currentMember.memberType.name} (${currentMember.memberType.price})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legacy DNI param support */}
        {!currentMember && (
          <>
            {loadingMember ? (
              <div className="loading-state">Cargando información del miembro...</div>
            ) : memberData?.memberByDni ? (
              <div className="member-info-card">
                <h3>Información del Miembro</h3>
                <div className="member-info-grid">
                  <div className="info-item">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">{memberData.memberByDni.firstName} {memberData.memberByDni.lastName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">DNI:</span>
                    <span className="info-value">{memberData.memberByDni.documentId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tipo de Miembro:</span>
                    <span className="info-value">{memberData.memberByDni.memberType.name} (${memberData.memberByDni.memberType.price})</span>
                  </div>
                </div>
              </div>
            ) : dniParam ? (
              <div className="error-state">No se encontró un miembro con el DNI: {dniParam}</div>
            ) : (
              <div className="info-state">Busque y seleccione un miembro arriba para continuar</div>
            )}
          </>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="member-payment-form">
          <div className="form-section">
            <h3>Método de Pago</h3>
            <div className="form-group">
              <label htmlFor="paymentMethodId">Método de Pago *</label>
              <select
                id="paymentMethodId"
                {...register('paymentMethodId', { required: 'El método de pago es requerido' })}
                className={errors.paymentMethodId ? 'error' : ''}
                disabled={loadingPaymentMethods}
              >
                <option value="">Seleccione un método de pago</option>
                {paymentMethodsData?.institutionPaymentMethods.map((ipm) => (
                  <option key={ipm.id} value={ipm.paymentMethod.id}>
                    {ipm.paymentMethod.name}
                  </option>
                ))}
              </select>
              {errors.paymentMethodId && (
                <span className="error-message">{errors.paymentMethodId.message}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Pagos Mensuales</h3>
              <button
                type="button"
                className="btn-add"
                onClick={() =>
                  append({
                    month: new Date().getMonth() + 1,
                    year: currentYear,
                    amount: 0,
                    bonificado: false
                  })
                }
              >
                + Agregar Mes
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="payment-row">
                <div className="form-group">
                  <label htmlFor={`months.${index}.month`}>Mes</label>
                  <Controller
                    name={`months.${index}.month`}
                    control={control}
                    rules={{ required: 'El mes es requerido', min: 1, max: 12 }}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <select
                        {...rest}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className={errors.months?.[index]?.month ? 'error' : ''}
                      >
                        {MONTHS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.months?.[index]?.month && (
                    <span className="error-message">{errors.months[index]?.month?.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor={`months.${index}.year`}>Año</label>
                  <Controller
                    name={`months.${index}.year`}
                    control={control}
                    rules={{ required: 'El año es requerido' }}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <select
                        {...rest}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className={errors.months?.[index]?.year ? 'error' : ''}
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.months?.[index]?.year && (
                    <span className="error-message">{errors.months[index]?.year?.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor={`months.${index}.bonificado`}>Bonificar</label>
                  <Controller
                    name={`months.${index}.bonificado`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <label className="switch-container-inline">
                        <input
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => onChange(e.target.checked)}
                          className="switch-checkbox"
                        />
                        <span className="switch-slider"></span>
                      </label>
                    )}
                  />
                </div>

                <div className="form-group">
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/activos')}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={insertLoading || loadingTypes || (!currentMember && !memberData?.memberByDni)}
            >
              {insertLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .member-payment-container {
          max-width: 1400px;
          margin: 20px auto;
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .search-section h3 {
          margin: 0 0 12px 0;
          color: #1f2937;
          font-size: 18px;
        }

        .member-payment-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-section h3 {
          margin: 0 0 8px 0;
          color: #1f2937;
          font-size: 18px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
        }

        .section-header h3 {
          margin: 0;
          border-bottom: none;
          padding-bottom: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
        }

        .form-group input,
        .form-group select {
          padding: 9px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
          background-color: white;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 2px;
        }

        .payment-row {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1fr auto;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          align-items: end;
        }

        .btn-add,
        .btn-remove {
          padding: 9px 18px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-add {
          background-color: #10b981;
          color: white;
        }

        .btn-add:hover {
          background-color: #059669;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .btn-remove {
          background-color: #ef4444;
          color: white;
          margin-top: 22px;
          min-width: 90px;
        }

        .btn-remove:hover:not(:disabled) {
          background-color: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        .btn-remove:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 20px;
          margin-top: 8px;
          border-top: 2px solid #e5e7eb;
        }

        .btn-primary,
        .btn-secondary {
          padding: 11px 28px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background-color: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background-color: #d1d5db;
          transform: translateY(-1px);
        }

        /* Member info card */
        .member-info-card {
          background: #f0f9ff;
          border: 2px solid #0ea5e9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .member-info-card h3 {
          margin: 0 0 16px 0;
          color: #0c4a6e;
          font-size: 18px;
        }

        .member-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .info-item {
          display: flex;
          gap: 8px;
        }

        .info-label {
          font-weight: 600;
          color: #334155;
          min-width: 120px;
        }

        .info-value {
          color: #1e293b;
        }

        .loading-state,
        .error-state,
        .info-state {
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .loading-state {
          background: #f0f9ff;
          color: #0369a1;
          border: 2px solid #bae6fd;
        }

        .error-state {
          background: #fef2f2;
          color: #991b1b;
          border: 2px solid #fecaca;
        }

        .info-state {
          background: #f9fafb;
          color: #6b7280;
          border: 2px solid #e5e7eb;
        }

        @media (min-width: 768px) {
          .member-info-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .member-info-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        /* Switch styles */
        .switch-container-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 60px;
          height: 34px;
          cursor: pointer;
        }

        .switch-checkbox {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }

        .switch-slider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: 0.3s;
          border-radius: 34px;
        }

        .switch-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .switch-checkbox:checked + .switch-slider {
          background-color: #10b981;
        }

        .switch-checkbox:checked + .switch-slider:before {
          transform: translateX(26px);
        }

        .switch-checkbox:focus + .switch-slider {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        /* Desktop grande: payment-row más ancho */
        @media (min-width: 1024px) {
          .payment-row {
            grid-template-columns: 1.5fr 1.5fr 1fr auto;
            gap: 16px;
          }
        }

        /* Tablet */
        @media (max-width: 767px) {
          .member-payment-container {
            margin: 12px;
            padding: 16px;
          }

          .payment-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .btn-remove {
            margin-top: 0;
            width: 100%;
          }

          .form-actions {
            flex-direction: column-reverse;
            gap: 8px;
          }

          .form-actions button {
            width: 100%;
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-add {
            width: 100%;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .member-payment-container {
            margin: 8px;
            padding: 12px;
          }

          .form-section h3 {
            font-size: 16px;
          }

          .form-group label {
            font-size: 12px;
          }

          .form-group input,
          .form-group select {
            font-size: 14px;
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  )
}
