import { useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  closeContribution,
  fetchContributionDetail,
  fetchReport,
  resetDetail,
} from "../slice/contributionsSlice"

export function useContributionDetail(id: string) {
  const dispatch = useAppDispatch()
  const contribution = useAppSelector((state) => state.contributions.current)
  const report = useAppSelector((state) => state.contributions.report)
  const status = useAppSelector((state) => state.contributions.detailStatus)

  const refresh = useCallback(() => {
    void dispatch(fetchContributionDetail(id))
    void dispatch(fetchReport(id))
  }, [dispatch, id])

  useEffect(() => {
    dispatch(resetDetail())
    void dispatch(fetchContributionDetail(id))
    void dispatch(fetchReport(id))
  }, [dispatch, id])

  const close = useCallback(async (): Promise<boolean> => {
    try {
      const envelope = await dispatch(closeContribution(id)).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }, [dispatch, id])

  return { contribution, report, status, refresh, close }
}
