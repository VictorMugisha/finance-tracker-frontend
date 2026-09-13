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
