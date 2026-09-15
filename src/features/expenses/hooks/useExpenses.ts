import { useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import type { CreateExpenseInput, ListExpensesFilters, UpdateExpenseInput } from "../types/expense"
import { createExpense, fetchExpenses, resetExpenses, updateExpense } from "../slice/expensesSlice"

export function useExpenseActions() {
  const dispatch = useAppDispatch()

  const create = useCallback(
    async (input: CreateExpenseInput): Promise<boolean> => {
      try {
        const envelope = await dispatch(createExpense(input)).unwrap()
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
    async (id: string, input: UpdateExpenseInput): Promise<boolean> => {
      try {
        const envelope = await dispatch(updateExpense({ id, input })).unwrap()
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

export function useExpenses(filters: ListExpensesFilters) {
  const dispatch = useAppDispatch()
  const { type, contributionId } = filters
  const items = useAppSelector((state) => state.expenses.items)
  const status = useAppSelector((state) => state.expenses.status)
  const error = useAppSelector((state) => state.expenses.error)

  useEffect(() => {
    dispatch(resetExpenses())
    void dispatch(fetchExpenses({ type, contributionId }))
  }, [dispatch, type, contributionId])

  return { items, status, error, ...useExpenseActions() }
}
