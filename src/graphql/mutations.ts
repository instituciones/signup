import { gql } from '@apollo/client'

export const CREATE_PROVISIONAL_RECORD = gql`
  mutation CreateProvisionalRecord($input: CreateProvisionalRecordInput!) {
    createProvisionalRecord(input: $input) {
      id
      firstName
      lastName
      documentType
      documentNumber
      phoneArea
      phoneNumber
      email
      isMember
      memberNumber
      hasDebt
      installments
      annualPayment
      institutionId
      status
      createdAt
      updatedAt
    }
  }
`

export const CREATE_MEMBER_PAYMENT = gql`
  mutation CreateMemberPayment($input: CreateMemberPaymentInput!) {
    createMemberPayment(input: $input) {
      id
      memberId
      institutionId
      year
      month
      amount
      status
      createdAt
      updatedAt
    }
  }
`

// Type definitions for the mutation input
export interface CreateProvisionalRecordInput {
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  phoneArea: string
  phoneNumber: string
  email?: string
  isMember: boolean
  memberNumber?: string
  hasDebt: boolean
  selectedPlan: string
  installments: number
  annualPayment: boolean
  photoUrl?: string
  institutionId: string
}

export interface CreateMemberPaymentInput {
  memberId: string
  institutionId: string
  year: number
  month: number
  amount: number
  status: string
  installments: number
}

export interface MemberPayment {
  id: string
  memberId: string
  institutionId: string
  year: number
  month: number
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProvisionalRecord {
  id: string
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  phoneArea: string
  phoneNumber: string
  email?: string
  isMember: boolean
  memberNumber?: string
  hasDebt: boolean
  installments: number
  annualPayment: boolean
  institutionId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}