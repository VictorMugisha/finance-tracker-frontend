import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchPermissions } from "../slice/permissionsSlice"

export function usePermissions() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.permissions.items)
  const status = useAppSelector((state) => state.permissions.status)

  useEffect(() => {
    void dispatch(fetchPermissions())
  }, [dispatch])

  return { items, isLoading: status === "idle" || status === "loading" }
}
