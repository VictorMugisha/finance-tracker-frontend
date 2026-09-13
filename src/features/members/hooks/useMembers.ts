import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useDebounce } from "@/hooks/useDebounce"
import type { CreateMemberInput, UpdateMemberInput } from "../types/member"
import { createMember, deactivateMember, fetchMembers, updateMember } from "../slice/membersSlice"

export function useMembers() {
  const dispatch = useAppDispatch()
  const members = useAppSelector((state) => state.members.members)
  const status = useAppSelector((state) => state.members.status)
  const error = useAppSelector((state) => state.members.error)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    void dispatch(fetchMembers(debouncedSearch.trim() || undefined))
  }, [dispatch, debouncedSearch])

  const create = async (input: CreateMemberInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(createMember(input)).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const update = async (id: string, input: UpdateMemberInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(updateMember({ id, input })).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const deactivate = async (id: string): Promise<boolean> => {
    try {
      const envelope = await dispatch(deactivateMember(id)).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  return {
    members,
    status,
    error,
    search,
    setSearch,
    create,
    update,
    deactivate,
  }
}
