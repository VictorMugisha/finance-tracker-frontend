import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { fetchContributions } from "../slice/contributionsSlice"

export function useContributionsOptions() {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const contributions = useAppSelector((state) => state.contributions.items)
  const status = useAppSelector((state) => state.contributions.status)

  const canRead = user ? user.isAdmin || user.permissions.includes("contributions:read") : false

  useEffect(() => {
    if (canRead) {
      void dispatch(fetchContributions(undefined))
    }
  }, [dispatch, canRead])

  return {
    contributions,
    isLoading: status === "idle" || status === "loading",
    canRead,
  }
}
