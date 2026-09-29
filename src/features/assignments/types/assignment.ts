export interface AssignmentDto {
  id: string
  contributionId: string
  memberId: string
  memberName: string
  requiredAmount: string
}

export interface CreateAssignmentInput {
  memberId: string
  requiredAmount: string
}

export interface UpdateAssignmentInput {
  requiredAmount: string
}

export interface AssignBulkInput {
  memberIds: string[]
  amount: string
}

export interface AssignBulkResult {
  assigned: number
}
