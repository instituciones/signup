export interface FormData {
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  phoneArea: string
  phoneNumber: string
  email: string
  isMember: boolean
  memberNumber?: string
  hasDebt: boolean
  selectedPlan?: string
  installments: number
  annualPayment: boolean
  photoUrl?: string
  institutionId: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface Plan {
  id: string
  name: string
  price: number
}