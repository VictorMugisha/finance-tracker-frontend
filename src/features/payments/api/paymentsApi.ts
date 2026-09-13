import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { CreatePaymentInput, PaymentDto, UpdatePaymentInput } from "../types/payment"

async function listPayments(contributionId: string): Promise<Envelope<PaymentDto[]>> {
  const res = await api.get<Envelope<PaymentDto[]>>("/payments", {
    params: { contributionId },
  })
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
