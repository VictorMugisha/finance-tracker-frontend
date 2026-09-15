export type ContributionType = "TARGETED" | "OPEN"
export type ContributionStatus = "OPEN" | "CLOSED"

export interface ContributionDto {
  id: string
  title: string
  description: string | null
  type: ContributionType
  targetAmount: string | null
  deadline: string | null
  status: ContributionStatus
  createdAt: string
  totalCollected: string
  totalRequired: string
  totalDisbursed: string
  net: string
}

export interface TargetedMemberReportItem {
  memberId: string
  name: string
  phone: string | null
  required: string
  paid: string
  balance: string
}

export interface OpenMemberReportItem {
  memberId: string
  name: string
  phone: string | null
  totalPaid: string
}

export interface ContributionReportResponse {
  contribution: ContributionDto
  members: TargetedMemberReportItem[] | OpenMemberReportItem[]
}

export interface GroupBalanceResponse {
  totalCollected: string
  totalDisbursed: string
  balance: string
}

export interface CreateContributionInput {
  title: string
  description: string | null
  type: ContributionType
  targetAmount: string | null
  deadline: string | null
}

export interface UpdateContributionInput {
  title?: string
  description?: string | null
  targetAmount?: string | null
  deadline?: string | null
}

export interface ListContributionsFilters {
  type?: ContributionType
  status?: ContributionStatus
  search?: string
}
