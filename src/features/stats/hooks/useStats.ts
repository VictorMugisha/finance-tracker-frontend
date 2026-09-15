import { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchStats } from "../slice/statsSlice"

export function useStats(enabled: boolean) {
  const dispatch = useAppDispatch()
  const stats = useAppSelector((state) => state.stats.stats)
  const status = useAppSelector((state) => state.stats.status)

  useEffect(() => {
    if (enabled) {
      void dispatch(fetchStats())
    }
  }, [dispatch, enabled])

  const refresh = useCallback(() => {
    void dispatch(fetchStats())
  }, [dispatch])

  return { stats, status, refresh }
}
