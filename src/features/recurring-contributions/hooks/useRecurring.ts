import { useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import type { CreateRecurringInput, UpdateRecurringInput } from "../types/recurring"
import { createRecurring, fetchRecurringContributions, updateRecurring } from "../slice/recurringSlice"

export function useRecurring() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.recurring.items)
  const status = useAppSelector((state) => state.recurring.status)
  const error = useAppSelector((state) => state.recurring.error)

  useEffect(() => {
    void dispatch(fetchRecurringContributions())
  }, [dispatch])

  const create = async (input: CreateRecurringInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(createRecurring(input)).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const update = async (id: string, input: UpdateRecurringInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(updateRecurring({ id, input })).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  return { items, status, error, create, update }
}
