import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchMembers } from "../slice/membersSlice"

export function useMembersOptions() {
  const dispatch = useAppDispatch()
  const members = useAppSelector((state) => state.members.members)
  const status = useAppSelector((state) => state.members.status)

  useEffect(() => {
    void dispatch(fetchMembers(undefined))
  }, [dispatch])

  const activeMembers = members
    .filter((member) => member.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    members: activeMembers,
    isLoading: status === "idle" || status === "loading",
  }
}
