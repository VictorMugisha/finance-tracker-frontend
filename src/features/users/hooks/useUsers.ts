import { useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import type { CreateUserInput, UpdateUserInput } from "../types/user"
import { createUser, fetchUsers, setUserPermissions, updateUser } from "../slice/usersSlice"

export function useUserActions() {
  const dispatch = useAppDispatch()

  const create = useCallback(
    async (input: CreateUserInput): Promise<boolean> => {
      try {
        const envelope = await dispatch(createUser(input)).unwrap()
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
    async (id: string, input: UpdateUserInput): Promise<boolean> => {
      try {
        const envelope = await dispatch(updateUser({ id, input })).unwrap()
        toast.success(formatToastMessage(envelope.statusCode, envelope.message))
        return true
      } catch (err) {
        toast.error(formatErrorToast(err))
        return false
      }
    },
    [dispatch]
  )

  const setPermissions = useCallback(
    async (id: string, permissions: string[]): Promise<boolean> => {
      try {
        const envelope = await dispatch(setUserPermissions({ id, permissions })).unwrap()
        toast.success(formatToastMessage(envelope.statusCode, envelope.message))
        return true
      } catch (err) {
        toast.error(formatErrorToast(err))
        return false
      }
    },
    [dispatch]
  )

  return { create, update, setPermissions }
}

export function useUsers() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.users.items)
  const status = useAppSelector((state) => state.users.status)
  const error = useAppSelector((state) => state.users.error)

  useEffect(() => {
    void dispatch(fetchUsers())
  }, [dispatch])

  return { items, status, error, ...useUserActions() }
}
