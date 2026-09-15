import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatMoney } from "@/utils/format"
import { EXPENSE_TYPE_LABELS } from "../types/expense"
import type { ExpenseDto } from "../types/expense"
import ExpenseActionsMenu from "./ExpenseActionsMenu"

interface ExpensesListProps {
  expenses: ExpenseDto[]
  canWrite: boolean
  onEdit: (expense: ExpenseDto) => void
}

function TypeBadge({ type }: { type: ExpenseDto["type"] }) {
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {EXPENSE_TYPE_LABELS[type]}
    </span>
  )
}

export default function ExpensesList({ expenses, canWrite, onEdit }: ExpensesListProps) {
  if (expenses.length === 0) {
    return <p className="text-sm text-muted-foreground">No expenses found.</p>
  }

  function renderActions(expense: ExpenseDto) {
    if (!canWrite) {
      return null
    }
    return <ExpenseActionsMenu expense={expense} onEdit={onEdit} />
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Contribution</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <TypeBadge type={expense.type} />
                </TableCell>
                <TableCell>{expense.description ?? "—"}</TableCell>
                <TableCell>{expense.contributionTitle ?? "General"}</TableCell>
                <TableCell>{expense.recipientMemberName ?? "—"}</TableCell>
                <TableCell className="text-right">{formatMoney(expense.amount)}</TableCell>
                <TableCell>{format(new Date(expense.spentAt), "dd/MM/yyyy")}</TableCell>
                <TableCell className="text-right">{renderActions(expense)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {expenses.map((expense) => (
          <li key={expense.id}>
            <Card>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <TypeBadge type={expense.type} />
                    <span className="truncate font-medium">{formatMoney(expense.amount)}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {expense.description ?? expense.contributionTitle ?? "General"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {format(new Date(expense.spentAt), "dd/MM/yyyy")}
                  </p>
                </div>
                {renderActions(expense)}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
