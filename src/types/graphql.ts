export interface ProvisionalRecord {
  id: string
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  phoneArea: string
  phoneNumber: string
  email: string
  photoUrl?: string
  isMember: boolean
  memberNumber?: string
  hasDebt: boolean
  installments: number
  annualPayment: boolean
  selectedPlan?: string
  status: string
  attrs?: any
  createdAt: string
  updatedAt: string
}

export interface GetPendingProvisionalRecordsResponse {
  pendingProvisionalRecords: ProvisionalRecord[]
}