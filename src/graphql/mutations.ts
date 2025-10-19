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

export const CREATE_MEMBER = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      id
      firstName
      lastName
      documentId
      documentType
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

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        role
        institution {
          id
          name
          logo
          colors
        }
      }
    }
  }
`

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($id: ID!, $input: UpdateMemberInput!) {
    updateMember(id: $id, input: $input) {
      id
      firstName
      lastName
      memberNumber
      phoneArea
      phoneNumber
    }
  }
`

export const INSERT_MEMBERS = gql`
  mutation InsertMembers($input: InsertMembersInput!) {
    insertMembers(input: $input) {
      id
      firstName
      lastName
      documentId
      memberType {
        id
        name
      }
      user {
        id
        email
      }
    }
  }
`

export const CREATE_MEMBER_PAYMENT_BY_ID = gql`
  mutation CreateMemberPaymentById($input: CreateMemberPaymentByIdInput!) {
    createMemberPaymentById(input: $input) {
      id
      month
      year
      amount
      status
    }
  }
`

// Type definitions for the mutation input
export interface CreateMemberInput {
  firstName: string
  lastName: string
  phoneArea: string
  phoneNumber: string
  documentId: string
  documentType: string
  email?: string
  memberNumber?: string
  photoUrl?: string
  memberTypeId: string
}

export interface Member {
  id: string
  firstName: string
  lastName: string
  documentId: string
  documentType: string
}

export interface CreateMemberResponse {
  createMember: Member
}

export interface LoginInput {
  email: string
  password: string
}

export interface Institution {
  id: string
  name: string
  logo?: string
  colors: string[]
}

export interface AuthUser {
  id: string
  email: string
  role?: string
  institution: Institution
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginResponse {
  login: AuthResponse
}

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
  id: string
  memberId: string
  paymentMethodId: string
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

export interface UpdateMemberInput {
  memberNumber?: string
  firstName?: string
  lastName?: string
  phoneArea?: string
  phoneNumber?: string
  email?: string
}

export interface UpdateMemberResponse {
  updateMember: {
    id: string
    firstName: string
    lastName: string
    memberNumber: string
    phoneArea: string
    phoneNumber: string
    email?: string
  }
}

export interface MonthPayment {
  month: number
  year: number
  value: number
}

export interface MonthPaymentById {
  month: number
  year: number
  amount: number
}

export interface InsertMembersInput {
  dni: string
  memberType: string
  months: MonthPayment[]
}

export interface CreateMemberPaymentByIdInput {
  memberId: string
  paymentMethodId: string
  months: MonthPaymentById[]
}

export interface CreateMemberPaymentByIdResponse {
  createMemberPaymentById: {
    id: string
    month: number
    year: number
    amount: number
    status: string
  }[]
}

export interface InsertMembersResponse {
  insertMembers: {
    id: string
    firstName: string
    lastName: string
    documentId: string
    memberType: {
      id: string
      name: string
    }
    user: {
      id: string
      email: string
    }
  }
}