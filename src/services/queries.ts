import { gql } from '@apollo/client'

export const GET_PENDING_PROVISIONAL_RECORDS = gql`
  query GetPendingProvisionalRecords {
    pendingProvisionalRecords {
      id
      firstName
      lastName
      documentType
      documentNumber
      phoneArea
      phoneNumber
      email
      photoUrl
      isMember
      memberNumber
      hasDebt
      installments
      annualPayment
      selectedPlan
      status
      attrs
      createdAt
      updatedAt
    }
  }
`