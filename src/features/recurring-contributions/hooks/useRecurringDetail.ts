import { useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  closeRecurring,
  fetchRecurringDetail,
  fetchRecurringReport,
  reopenRecurring,
  resetDetail,
  rolloverRecurring,
} from "../slice/recurringSlice"

export function useRecurringDetail(id: string) {
  const dispatch = useAppDispatch()
  const recurring = useAppSelector((state) => state.recurring.current)
  const periods = useAppSelector((state) => state.recurring.periods)
  const detailStatus = useAppSelector((state) => state.recurring.detailStatus)
  const report = useAppSelector((state) => state.recurring.report)
  const reportStatus = useAppSelector((state) => state.recurring.reportStatus)

  useEffect(() => {
    dispatch(resetDetail())
    void dispatch(fetchRecurringDetail(id))
    void dispatch(fetchRecurringReport(id))
  }, [dispatch, id])

  const refresh = useCallback(() => {
    void dispatch(fetchRecurringDetail(id))
    void dispatch(fetchRecurringReport(id))
  }, [dispatch, id])

  const rollover = async (label: string | null): Promise<boolean> => {
    try {
      const envelope = await dispatch(rolloverRecurring({ id, input: { label } })).unwrap()
      const suffix =
        envelope.data.assigned > 0 ? ` (${envelope.data.assigned} members assigned)` : ""
      toast.success(`Period ${envelope.data.period} created${suffix}`)
      refresh()
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const close = async (): Promise<boolean> => {
    try {
      await dispatch(closeRecurring(id)).unwrap()
      toast.success("Recurring contribution closed")
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const reopen = async (): Promise<boolean> => {
    try {
      await dispatch(reopenRecurring(id)).unwrap()
      toast.success("Recurring contribution reopened")
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  return { recurring, periods, report, detailStatus, reportStatus, refresh, rollover, close, reopen }
}
