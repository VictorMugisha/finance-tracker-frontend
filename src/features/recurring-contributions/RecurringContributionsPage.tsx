import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "cn"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRemountKey } from "@/hooks/useRemountKey"
import { formatMoney } from "@/utils/format"
import RecurringActionsMenu from "./components/RecurringActionsMenu"
import RecurringContributionFormDialog, {
  type RecurringSubmitInput,
} from "./components/RecurringContributionFormDialog"
import { useRecurring } from "./hooks/useRecurring"
import type { RecurringContributionDto, RecurringPeriod } from "./types/recurring"

const PERIOD_LABELS: Record<RecurringPeriod, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
}

export default function RecurringContributionsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, status, error, create, update } = useRecurring()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<RecurringContributionDto | null>(null)
  const { key: formKey, remount: remountForm } = useRemountKey()

  const has = (key: string) => (user ? user.isAdmin || user.permissions.includes(key) : false)
  const canCreate = has("contributions:create")
  const canWrite = has("contributions:update")

  const openCreate = () => {
    setEditing(null)
    remountForm()
    setFormOpen(true)
  }

  const openEdit = (recurring: RecurringContributionDto) => {
    setEditing(recurring)
    remountForm()
    setFormOpen(true)
  }

  const handleSubmit = async (input: RecurringSubmitInput) => {
    return editing ? update(editing.id, input) : create(input)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Recurring contributions</h1>
          {canCreate ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New recurring
            </Button>
          ) : null}
        </div>

        {status === "loading" && items.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recurring contributions yet.</p>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Periods</TableHead>
                    <TableHead>Target / period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((recurring) => (
                    <TableRow
                      key={recurring.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/recurring-contributions/${recurring.id}`)}
                    >
                      <TableCell className="font-medium">{recurring.title}</TableCell>
                      <TableCell>{PERIOD_LABELS[recurring.period]}</TableCell>
                      <TableCell>{recurring.periodCount}</TableCell>
                      <TableCell>
                        {recurring.targetAmount ? formatMoney(recurring.targetAmount) : "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            recurring.isClosed
                              ? "bg-muted text-muted-foreground"
                              : "bg-emerald-500/10 text-emerald-600"
                          )}
                        >
                          {recurring.isClosed ? "Closed" : "Open"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                        {canWrite ? (
                          <RecurringActionsMenu recurring={recurring} onEdit={openEdit} />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <ul className="flex flex-col gap-3 md:hidden">
              {items.map((recurring) => (
                <li key={recurring.id}>
                  <Card
                    className="cursor-pointer"
                    onClick={() => navigate(`/recurring-contributions/${recurring.id}`)}
                  >
                    <CardContent className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{recurring.title}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {PERIOD_LABELS[recurring.period]} · {recurring.periodCount} period
                          {recurring.periodCount === 1 ? "" : "s"}
                        </p>
                        {recurring.targetAmount ? (
                          <p className="text-sm text-muted-foreground">
                            {formatMoney(recurring.targetAmount)}
                          </p>
                        ) : null}
                      </div>
                      <div
                        className="flex shrink-0 items-center gap-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            recurring.isClosed
                              ? "bg-muted text-muted-foreground"
                              : "bg-emerald-500/10 text-emerald-600"
                          )}
                        >
                          {recurring.isClosed ? "Closed" : "Open"}
                        </span>
                        {canWrite ? (
                          <RecurringActionsMenu recurring={recurring} onEdit={openEdit} />
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>

      <RecurringContributionFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        recurring={editing}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
