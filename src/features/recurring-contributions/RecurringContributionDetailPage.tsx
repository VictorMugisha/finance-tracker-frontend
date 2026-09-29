import { useState } from "react"
import { ArrowLeft, Lock, LockOpen, Loader2, Pencil, RefreshCw } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "cn"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRemountKey } from "@/hooks/useRemountKey"
import { formatMoney } from "@/utils/format"
import RolloverDialog from "./components/RolloverDialog"
import RecurringContributionFormDialog, {
  type RecurringSubmitInput,
} from "./components/RecurringContributionFormDialog"
import { useRecurringDetail } from "./hooks/useRecurringDetail"
import { useRecurring } from "./hooks/useRecurring"
import type { RecurringPeriod } from "./types/recurring"

const PERIOD_LABELS: Record<RecurringPeriod, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
}

function balanceColor(balance: string): string {
  const value = Number(balance)
  if (value > 0) return "text-emerald-600"
  if (value < 0) return "text-destructive"
  return "text-muted-foreground"
}

export default function RecurringContributionDetailPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { recurring, periods, report, detailStatus, rollover, close, reopen } =
    useRecurringDetail(id)
  const { update } = useRecurring()
  const [closeOpen, setCloseOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [rolloverOpen, setRolloverOpen] = useState(false)
  const { key: editKey, remount: remountEdit } = useRemountKey()
  const { key: rolloverKey, remount: remountRollover } = useRemountKey()

  const has = (key: string) => (user ? user.isAdmin || user.permissions.includes(key) : false)
  const canCreate = has("contributions:create")
  const canWrite = has("contributions:update")

  const openEdit = () => {
    remountEdit()
    setEditOpen(true)
  }

  const openRollover = () => {
    remountRollover()
    setRolloverOpen(true)
  }

  const handleEdit = async (input: RecurringSubmitInput) => {
    return update(id, input)
  }

  if (detailStatus === "loading" || detailStatus === "idle") {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!recurring) {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">Recurring contribution not found.</p>
        </div>
      </div>
    )
  }

  const isClosed = recurring.isClosed
  const members = report?.members ?? []
  const totalRequired = members.reduce((sum, m) => sum + Number(m.totalRequired), 0)
  const totalPaid = members.reduce((sum, m) => sum + Number(m.totalPaid), 0)

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">
        <button
          type="button"
          onClick={() => navigate("/recurring-contributions")}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to recurring contributions
        </button>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{recurring.title}</h1>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {PERIOD_LABELS[recurring.period]}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  isClosed
                    ? "bg-muted text-muted-foreground"
                    : "bg-emerald-500/10 text-emerald-600"
                )}
              >
                {isClosed ? "Closed" : "Open"}
              </span>
            </div>
            {recurring.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{recurring.description}</p>
            ) : null}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {canCreate && !isClosed ? (
            <Button onClick={openRollover}>
              <RefreshCw className="size-4" />
              Roll over
            </Button>
          ) : null}
          {canWrite && !isClosed ? (
            <Button variant="outline" onClick={openEdit}>
              <Pencil className="size-4" />
              Edit
            </Button>
          ) : null}
          {canWrite && !isClosed ? (
            <Button variant="outline" onClick={() => setCloseOpen(true)}>
              <Lock className="size-4" />
              Close
            </Button>
          ) : null}
          {canWrite && isClosed ? (
            <Button variant="outline" onClick={() => void reopen()}>
              <LockOpen className="size-4" />
              Reopen
            </Button>
          ) : null}
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Target / period</p>
            <p className="text-lg font-semibold">
              {recurring.targetAmount ? formatMoney(recurring.targetAmount) : "—"}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Total required</p>
            <p className="text-lg font-semibold">{formatMoney(String(totalRequired))}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Total paid</p>
            <p className="text-lg font-semibold">{formatMoney(String(totalPaid))}</p>
          </div>
        </div>

        <Tabs defaultValue="periods">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="periods">Periods</TabsTrigger>
            <TabsTrigger value="cumulative">Cumulative per member</TabsTrigger>
          </TabsList>

          <TabsContent value="periods">
            {periods.length === 0 ? (
              <p className="text-sm text-muted-foreground">No periods yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {periods.map((period) => (
                  <li key={period.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/contributions/${period.id}`)}
                      className="flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{period.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {period.periodLabel ?? `Period ${period.recurringPeriod}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Collected {formatMoney(period.totalCollected)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            period.status === "OPEN"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {period.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatMoney(period.totalRequired)} required
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="cumulative">
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No member activity yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead className="text-right">Required</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.memberId}>
                        <TableCell className="font-medium">
                          {member.name}
                          {!member.isActive ? (
                            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              Inactive
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatMoney(member.totalRequired)}
                        </TableCell>
                        <TableCell className="text-right">{formatMoney(member.totalPaid)}</TableCell>
                        <TableCell
                          className={cn("text-right font-medium", balanceColor(member.balance))}
                        >
                          {formatMoney(member.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <RolloverDialog
        key={rolloverKey}
        open={rolloverOpen}
        onOpenChange={setRolloverOpen}
        onSubmit={rollover}
      />
      <RecurringContributionFormDialog
        key={editKey}
        open={editOpen}
        onOpenChange={setEditOpen}
        recurring={recurring}
        onSubmit={handleEdit}
      />
      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Close recurring contribution?"
        description={`This stops "${recurring.title}" from being rolled over, but deposits can still be recorded against existing periods.`}
        confirmLabel="Close"
        onConfirm={close}
      />
    </div>
  )
}
