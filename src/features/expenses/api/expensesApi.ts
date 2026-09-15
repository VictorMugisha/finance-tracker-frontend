import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type {
  CreateExpenseInput,
  ExpenseDto,
  ListExpensesFilters,
  UpdateExpenseInput,
} from "../types/expense"

async function listExpenses(filters: ListExpensesFilters): Promise<Envelope<ExpenseDto[]>> {
  const params: Record<string, string> = {}
  if (filters.type) params.type = filters.type
  if (filters.contributionId) params.contributionId = filters.contributionId
  const res = await api.get<Envelope<ExpenseDto[]>>("/expenses", { params })
  return res.data
}

async function getExpense(id: string): Promise<Envelope<ExpenseDto>> {
  const res = await api.get<Envelope<ExpenseDto>>(`/expenses/${id}`)
  return res.data
}

async function createExpense(input: CreateExpenseInput): Promise<Envelope<ExpenseDto>> {
  const res = await api.post<Envelope<ExpenseDto>>("/expenses", input)
  return res.data
}

async function updateExpense(id: string, input: UpdateExpenseInput): Promise<Envelope<ExpenseDto>> {
  const res = await api.patch<Envelope<ExpenseDto>>(`/expenses/${id}`, input)
  return res.data
}

export const expensesApi = {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
}
