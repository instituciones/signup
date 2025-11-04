import { gql } from '@apollo/client'

export const GET_PENDING_PROVISIONAL_RECORDS = gql`
  query GetPendingProvisionalRecords($status: String) {
    pendingProvisionalRecords(status: $status) {
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

export const GET_MEMBERS = gql`
  query GetMembers($filters: MemberFilters) {
    members(filters: $filters) {
      id
      firstName
      lastName
      memberNumber
      documentId
      documentType
      phoneArea
      phoneNumber
      user {
        email
      }
      memberType {
        id
        name
        price
      }
      payments {
        year
        month
        amount
        status
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MEMBER_TYPES = gql`
  query GetMemberTypes {
    memberTypes {
      id
      name
      price
      description
    }
  }
`

export const GET_MEMBER_BY_DNI = gql`
  query GetMemberByDni($documentId: String!, $documentType: String!) {
    memberByDni(documentId: $documentId, documentType: $documentType) {
      id
      firstName
      lastName
      documentId
      memberType {
        id
        name
        price
      }
    }
  }
`

export const GET_INSTITUTION_PAYMENT_METHODS = gql`
  query GetInstitutionPaymentMethods {
    institutionPaymentMethods(activeOnly: true) {
      id
      paymentMethod {
        id
        name
      }
    }
  }
`