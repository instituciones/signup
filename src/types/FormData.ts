export interface FormData {
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  areaCode: string
  phoneNumber: string
  email: string
  isMember: boolean
  memberNumber?: string
  hasDebt: boolean
  selectedPlan?: string
  installments: number
  annualPayment: boolean
  photoUrl?: string
}

export interface Plan {
  id: string
  name: string
  price: number
}