export type ExpenseType = "HANDOVER" | "MEMBER_SUPPORT" | "LEISURE" | "OTHER"

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  HANDOVER: "Handover",
  MEMBER_SUPPORT: "Member support",
  LEISURE: "Leisure",
  OTHER: "Other",
}

export const EXPENSE_TYPES: ExpenseType[] = ["HANDOVER", "MEMBER_SUPPORT", "LEISURE", "OTHER"]

export interface ExpenseDto {
  id: string
  contributionId: string | null
  contributionTitle: string | null
  type: ExpenseType
  amount: string
  recipientMemberId: string | null
  recipientMemberName: string | null
  description: string | null
  spentAt: string
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseInput {
  contributionId: string | null
  type: ExpenseType
  amount: string
  recipientMemberId: string | null
  description: string | null
  spentAt: string
}

export interface UpdateExpenseInput {
  contributionId?: string | null
  type?: ExpenseType
  amount?: string
  recipientMemberId?: string | null
  description?: string | null
  spentAt?: string
}

export interface ListExpensesFilters {
  type?: ExpenseType
  contributionId?: string
}
