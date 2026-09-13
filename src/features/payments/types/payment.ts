export interface PaymentDto {
  id: string
  contributionId: string
  contributionTitle: string
  memberId: string
  memberName: string
  amount: string
  paidAt: string
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentInput {
  contributionId: string
  memberId: string
  amount: string
  note: string | null
  paidAt?: string | null
}

export interface UpdatePaymentInput {
  amount?: string
  note?: string | null
  paidAt?: string
}
