import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { CreatePaymentInput, PaymentDto, UpdatePaymentInput } from "../types/payment"

export interface ListPaymentsFilters {
  contributionId?: string
  memberId?: string
}

async function listPayments(filters: ListPaymentsFilters): Promise<Envelope<PaymentDto[]>> {
  const params: Record<string, string> = {}
  if (filters.contributionId) params.contributionId = filters.contributionId
  if (filters.memberId) params.memberId = filters.memberId
  const res = await api.get<Envelope<PaymentDto[]>>("/payments", { params })
  return res.data
}

async function createPayment(input: CreatePaymentInput): Promise<Envelope<PaymentDto>> {
  const res = await api.post<Envelope<PaymentDto>>("/payments", input)
  return res.data
}

async function updatePayment(id: string, input: UpdatePaymentInput): Promise<Envelope<PaymentDto>> {
  const res = await api.patch<Envelope<PaymentDto>>(`/payments/${id}`, input)
  return res.data
}

export const paymentsApi = {
  listPayments,
  createPayment,
  updatePayment,
}
