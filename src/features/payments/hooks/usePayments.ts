import { useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import type { ListPaymentsFilters } from "../api/paymentsApi"
import type { CreatePaymentInput, UpdatePaymentInput } from "../types/payment"
import { createPayment, fetchPayments, resetPayments, updatePayment } from "../slice/paymentsSlice"

export function usePaymentActions() {
  const dispatch = useAppDispatch()

  const create = useCallback(
    async (input: CreatePaymentInput): Promise<boolean> => {
      try {
        const envelope = await dispatch(createPayment(input)).unwrap()
        toast.success(formatToastMessage(envelope.statusCode, envelope.message))
        return true
      } catch (err) {
        toast.error(formatErrorToast(err))
        return false
      }
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, input: UpdatePaymentInput): Promise<boolean> => {
      try {
        const envelope = await dispatch(updatePayment({ id, input })).unwrap()
        toast.success(formatToastMessage(envelope.statusCode, envelope.message))
        return true
      } catch (err) {
        toast.error(formatErrorToast(err))
        return false
      }
    },
    [dispatch]
  )

  return { create, update }
}

export function usePayments(filters: ListPaymentsFilters) {
  const dispatch = useAppDispatch()
  const { contributionId, memberId } = filters
  const items = useAppSelector((state) => state.payments.items)
  const status = useAppSelector((state) => state.payments.status)
  const error = useAppSelector((state) => state.payments.error)

  useEffect(() => {
    if (!contributionId) {
      return
    }
    dispatch(resetPayments())
    void dispatch(fetchPayments({ contributionId, memberId }))
  }, [dispatch, contributionId, memberId])

  return { items, status, error, ...usePaymentActions() }
}
