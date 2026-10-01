import type { ContributionDto } from "@/features/contributions/types/contribution"

export type RecurringPeriod = "WEEKLY" | "MONTHLY" | "QUARTERLY"

export interface RecurringContributionDto {
  id: string
  title: string
  description: string | null
  period: RecurringPeriod
  targetAmount: string | null
  isClosed: boolean
  createdAt: string
  periodCount: number
}

export interface RecurringContributionDetailResponse {
  recurring: RecurringContributionDto
  periods: ContributionDto[]
}

export interface RecurringPeriodSummary {
  id: string
  period: number
  status: "OPEN" | "CLOSED"
  createdAt: string
  totalRequired: string
  totalCollected: string
  totalDisbursed: string
  net: string
}

export interface RecurringMemberReportItem {
  memberId: string
  name: string
  phone: string | null
  isActive: boolean
  totalRequired: string
  totalPaid: string
  balance: string
}

export interface RecurringReportResponse {
  recurring: RecurringContributionDto
  periods: RecurringPeriodSummary[]
  members: RecurringMemberReportItem[]
}

export interface RolloverResult {
  id: string
  period: number
  assigned: number
}

export interface RolloverInput {
  title: string
}

export interface CreateRecurringInput {
  title: string
  description: string | null
  period: RecurringPeriod
  targetAmount: string
}

export interface UpdateRecurringInput {
  title?: string
  description?: string | null
  period?: RecurringPeriod
  targetAmount?: string
}
