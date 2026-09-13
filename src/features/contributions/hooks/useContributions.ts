import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useDebounce } from "@/hooks/useDebounce"
import type {
  ContributionStatus,
  ContributionType,
  CreateContributionInput,
  UpdateContributionInput,
} from "../types/contribution"
import {
  closeContribution,
  createContribution,
  fetchBalance,
  fetchContributions,
  updateContribution,
} from "../slice/contributionsSlice"

export function useContributions() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.contributions.items)
  const status = useAppSelector((state) => state.contributions.status)
  const error = useAppSelector((state) => state.contributions.error)
  const balance = useAppSelector((state) => state.contributions.balance)
  const [search, setSearch] = useState("")
  const [type, setType] = useState<ContributionType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | "all">("all")
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    void dispatch(fetchBalance())
  }, [dispatch])

  useEffect(() => {
    void dispatch(
      fetchContributions({
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(type !== "all" ? { type } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      })
    )
  }, [dispatch, debouncedSearch, type, statusFilter])

  const create = async (input: CreateContributionInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(createContribution(input)).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const update = async (id: string, input: UpdateContributionInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(updateContribution({ id, input })).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const close = async (id: string): Promise<boolean> => {
    try {
      const envelope = await dispatch(closeContribution(id)).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  return {
    items,
    status,
    error,
    balance,
    search,
    setSearch,
    type,
    setType,
    statusFilter,
    setStatusFilter,
    create,
    update,
    close,
  }
}
