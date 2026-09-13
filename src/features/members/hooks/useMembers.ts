import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchMembers } from "../slice/membersSlice"

export function useMembers() {
  const dispatch = useAppDispatch()
  const members = useAppSelector((state) => state.members.members)
  const status = useAppSelector((state) => state.members.status)
  const error = useAppSelector((state) => state.members.error)
  const [search, setSearch] = useState("")

  useEffect(() => {
    void dispatch(fetchMembers(search.trim() || undefined))
  }, [dispatch, search])

  return {
    members,
    status,
    error,
    search,
    setSearch,
  }
}
