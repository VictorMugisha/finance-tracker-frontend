import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type {
  AssignmentDto,
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from "../types/assignment"

async function listAssignments(contributionId: string): Promise<Envelope<AssignmentDto[]>> {
  const res = await api.get<Envelope<AssignmentDto[]>>(
    `/contributions/${contributionId}/assignments`
  )
  return res.data
}

async function createAssignment(
  contributionId: string,
  input: CreateAssignmentInput
): Promise<Envelope<AssignmentDto>> {
  const res = await api.post<Envelope<AssignmentDto>>(
    `/contributions/${contributionId}/assignments`,
    input
  )
  return res.data
}

async function updateAssignment(
  contributionId: string,
  assignmentId: string,
  input: UpdateAssignmentInput
): Promise<Envelope<AssignmentDto>> {
  const res = await api.patch<Envelope<AssignmentDto>>(
    `/contributions/${contributionId}/assignments/${assignmentId}`,
    input
  )
  return res.data
}

async function removeAssignment(
  contributionId: string,
  assignmentId: string
): Promise<Envelope<AssignmentDto>> {
  const res = await api.delete<Envelope<AssignmentDto>>(
    `/contributions/${contributionId}/assignments/${assignmentId}`
  )
  return res.data
}

export const assignmentsApi = {
  listAssignments,
  createAssignment,
  updateAssignment,
  removeAssignment,
}
