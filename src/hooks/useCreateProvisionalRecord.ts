import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { FormData } from '../types/FormData'
import { CREATE_PROVISIONAL_RECORD, CreateProvisionalRecordInput, ProvisionalRecord } from '../graphql/mutations'

export const useCreateProvisionalRecord = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [provisionalRecord, setProvisionalRecord] = useState<ProvisionalRecord | null>(null)

  const [createProvisionalRecordMutation] = useMutation<{ createProvisionalRecord: ProvisionalRecord }, { input: CreateProvisionalRecordInput }>(CREATE_PROVISIONAL_RECORD)

  const createProvisionalRecord = async (formData: FormData): Promise<{ success: boolean; record?: ProvisionalRecord; error?: string }> => {
    setIsCreating(true)
    setCreateError(null)

    try {
      // Prepare the input data
      const input: CreateProvisionalRecordInput = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        phoneArea: formData.phoneArea,
        phoneNumber: formData.phoneNumber,
        email: formData.email || undefined,
        isMember: formData.isMember,
        memberNumber: formData.memberNumber || undefined,
        hasDebt: formData.hasDebt,
        selectedPlan: formData.selectedPlan!,
        installments: formData.installments,
        annualPayment: formData.annualPayment,
        photoUrl: formData.photoUrl || undefined,
        institutionId: formData.institutionId
      }

      const { data } = await createProvisionalRecordMutation({
        variables: { input }
      })

      if (data?.createProvisionalRecord) {
        const record = data.createProvisionalRecord
        setProvisionalRecord(record)
        return { success: true, record }
      } else {
        const error = 'No se pudo crear el registro provisional'
        setCreateError(error)
        return { success: false, error }
      }

    } catch (error) {
      let errorMessage = 'Error al crear el registro provisional'

      if (error instanceof Error) {
        errorMessage = error.message
      }

      setCreateError(errorMessage)
      return { success: false, error: errorMessage }

    } finally {
      setIsCreating(false)
    }
  }

  const resetCreation = () => {
    setCreateError(null)
    setProvisionalRecord(null)
  }

  return {
    isCreating,
    createError,
    provisionalRecord,
    createProvisionalRecord,
    resetCreation
  }
}