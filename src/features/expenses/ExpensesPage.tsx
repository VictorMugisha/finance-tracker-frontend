import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import { Button } from "@/components/ui/button"
import { SearchableSelectDropdown } from "@/components/shared/SearchableSelectDropdown"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useContributionsOptions } from "@/features/contributions/hooks/useContributionsOptions"
import { useRemountKey } from "@/hooks/useRemountKey"
import ExpenseFormDialog from "./components/ExpenseFormDialog"
import ExpensesList from "./components/ExpensesList"
import { useExpenses } from "./hooks/useExpenses"
import {
  EXPENSE_TYPE_LABELS,
  EXPENSE_TYPES,
  type CreateExpenseInput,
  type ExpenseDto,
  type ExpenseType,
} from "./types/expense"

export default function ExpensesPage() {
  const { user } = useAuth()
  const [typeFilter, setTypeFilter] = useState<ExpenseType | "all">("all")
  const [contributionFilter, setContributionFilter] = useState<string>("all")

  const { items, status, error, create, update } = useExpenses({
    type: typeFilter === "all" ? undefined : typeFilter,
    contributionId: contributionFilter === "all" ? undefined : contributionFilter,
  })
  const { contributions, canRead: canReadContributions } = useContributionsOptions()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ExpenseDto | null>(null)
  const { key: formKey, remount: remountForm } = useRemountKey()

  const has = (key: string) => (user ? user.isAdmin || user.permissions.includes(key) : false)
  const canRecord = has("expenses:record")
  const canUpdate = has("expenses:update")

  const openCreate = () => {
    setEditing(null)
    remountForm()
    setFormOpen(true)
  }

  const openEdit = (expense: ExpenseDto) => {
    setEditing(expense)
    remountForm()
    setFormOpen(true)
  }

  const handleSubmit = async (input: CreateExpenseInput) => {
    return editing ? update(editing.id, input) : create(input)
  }

  const typeOptions = [
    { value: "all", label: "All types" },
    ...EXPENSE_TYPES.map((value) => ({ value, label: EXPENSE_TYPE_LABELS[value] })),
  ]

  const contributionOptions = [
    { value: "all", label: "All contributions" },
    ...contributions.map((contribution) => ({
      value: contribution.id,
      label: contribution.title,
    })),
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Expenses</h1>
          {canRecord ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Record expense
            </Button>
          ) : null}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <SearchableSelectDropdown
            options={typeOptions}
            value={typeFilter}
            onChange={(value) => setTypeFilter(value as ExpenseType | "all")}
            triggerClassName="w-44"
            searchPlaceholder="Search..."
            emptyMessage="No results found."
          />
          {canReadContributions ? (
            <SearchableSelectDropdown
              options={contributionOptions}
              value={contributionFilter}
              onChange={setContributionFilter}
              triggerClassName="w-56"
              searchPlaceholder="Search..."
              emptyMessage="No results found."
            />
          ) : null}
        </div>

        {status === "loading" && items.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <ExpensesList expenses={items} canWrite={canUpdate} onEdit={openEdit} />
        )}
      </main>

      <ExpenseFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        expense={editing}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
