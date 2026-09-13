import { useEffect } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import type { CreateAssignmentInput, UpdateAssignmentInput } from "../types/assignment"
import {
  createAssignment,
  fetchAssignments,
  removeAssignment,
  resetAssignments,
  updateAssignment,
} from "../slice/assignmentsSlice"

export function useAssignments(contributionId: string) {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.assignments.items)
  const status = useAppSelector((state) => state.assignments.status)
  const error = useAppSelector((state) => state.assignments.error)

  useEffect(() => {
    dispatch(resetAssignments())
    void dispatch(fetchAssignments(contributionId))
  }, [dispatch, contributionId])

  const create = async (input: CreateAssignmentInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(createAssignment({ contributionId, input })).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const update = async (assignmentId: string, input: UpdateAssignmentInput): Promise<boolean> => {
    try {
      const envelope = await dispatch(
        updateAssignment({ contributionId, assignmentId, input })
      ).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  const remove = async (assignmentId: string): Promise<boolean> => {
    try {
      const envelope = await dispatch(removeAssignment({ contributionId, assignmentId })).unwrap()
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
      return true
    } catch (err) {
      toast.error(formatErrorToast(err))
      return false
    }
  }

  return { items, status, error, create, update, remove }
}
