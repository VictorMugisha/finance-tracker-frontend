import { useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import type { CreatePaymentInput, UpdatePaymentInput } from "../types/payment"
import { createPayment, fetchPayments, resetPayments, updatePayment } from "../slice/paymentsSlice"

export function usePayments(contributionId: string) {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.payments.items)
  const status = useAppSelector((state) => state.payments.status)
  const error = useAppSelector((state) => state.payments.error)

  useEffect(() => {
    dispatch(resetPayments())
    void dispatch(fetchPayments(contributionId))
  }, [dispatch, contributionId])

  const create = async (input: CreatePaymentInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(createPayment(input)).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const update = async (id: string, input: UpdatePaymentInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(updatePayment({ id, input })).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  return { items, status, error, create, update }
}
