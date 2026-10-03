import { useState } from "react"
import { ArrowLeft, Layers, Lock, LockOpen, Plus, Receipt } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "cn"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useAssignments } from "@/features/assignments/hooks/useAssignments"
import type { AssignmentDto, AssignBulkInput } from "@/features/assignments/types/assignment"
import AssignmentFormDialog from "@/features/assignments/components/AssignmentFormDialog"
import AssignBulkDialog from "@/features/assignments/components/AssignBulkDialog"
import { usePaymentActions } from "@/features/payments/hooks/usePayments"
import PaymentFormDialog from "@/features/payments/components/PaymentFormDialog"
import type { PaymentFormSubmitInput } from "@/features/payments/components/PaymentFormDialog"
import { useExpenseActions } from "@/features/expenses/hooks/useExpenses"
import ExpenseFormDialog from "@/features/expenses/components/ExpenseFormDialog"
import type { CreateExpenseInput } from "@/features/expenses/types/expense"
import { useRemountKey } from "@/hooks/useRemountKey"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { formatMoney } from "@/utils/format"
import ReportTable from "./components/ReportTable"
import { useContributionDetail } from "./hooks/useContributionDetail"

function SummaryCard({
  label,
  value,
  emphasized = false,
}: {
  label: string
  value: string
  emphasized?: boolean
}) {
  return (
    <div className={cn("rounded-lg border p-4", emphasized && "border-primary bg-primary/10")}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-lg font-semibold", emphasized && "text-primary")}>
        {formatMoney(value)}
      </p>
    </div>
  )
}

export default function ContributionDetailPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { contribution, report, status, refresh, close, reopen } = useContributionDetail(id)
  useDocumentTitle(contribution?.title ?? "Contribution")
  const {
    items: assignments,
    create: createAssignment,
    update: updateAssignment,
    remove: removeAssignment,
    assignBulk: assignBulkAction,
    refresh: refreshAssignments,
  } = useAssignments(id)
  const { create: createPayment } = usePaymentActions()
  const { create: createExpense } = useExpenseActions()

  const [closeOpen, setCloseOpen] = useState(false)
  const [assignmentOpen, setAssignmentOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<AssignmentDto | null>(null)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMember, setPaymentMember] = useState<{ id: string; name: string } | null>(null)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<AssignmentDto | null>(null)
  const { key: assignmentFormKey, remount: remountAssignmentForm } = useRemountKey()
  const { key: bulkAssignKey, remount: remountBulkAssign } = useRemountKey()
  const { key: paymentFormKey, remount: remountPaymentForm } = useRemountKey()
  const { key: expenseFormKey, remount: remountExpenseForm } = useRemountKey()

  const has = (key: string) => (user ? user.isAdmin || user.permissions.includes(key) : false)
  const canUpdate = has("contributions:update")
  const canRecordExpense = has("expenses:record")

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 p-4">
          <button
            type="button"
            onClick={() => navigate("/contributions")}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to contributions
          </button>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-11 w-32" />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
        </main>
      </div>
    )
  }

  if (!contribution) {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">Contribution not found.</p>
        </div>
      </div>
    )
  }

  const isTargeted = contribution.type === "TARGETED"
  const isOpen = contribution.status === "OPEN"
  const canAssign = isTargeted && isOpen && has("assignments:write")
  const canRecordPayment = has("payments:record")

  const memberName = (memberId: string): string =>
    report?.members.find((member) => member.memberId === memberId)?.name ?? ""

  const findAssignment = (memberId: string): AssignmentDto | undefined =>
    assignments.find((assignment) => assignment.memberId === memberId)

  const openAddAssignment = () => {
    setEditingAssignment(null)
    remountAssignmentForm()
    setAssignmentOpen(true)
  }

  const openAssignBulk = () => {
    remountBulkAssign()
    setBulkAssignOpen(true)
  }

  const openEditAssignment = (memberId: string) => {
    const assignment = findAssignment(memberId)
    if (!assignment) return
    setEditingAssignment(assignment)
    remountAssignmentForm()
    setAssignmentOpen(true)
  }

  const openRemoveAssignment = (memberId: string) => {
    const assignment = findAssignment(memberId)
    if (!assignment) return
    setRemoveTarget(assignment)
  }

  const openAddPayment = (memberId?: string) => {
    setPaymentMember(memberId ? { id: memberId, name: memberName(memberId) } : null)
    remountPaymentForm()
    setPaymentOpen(true)
  }

  const openRecordExpense = () => {
    remountExpenseForm()
    setExpenseOpen(true)
  }

  const viewDetails = (memberId: string) => {
    navigate(`/contributions/${contribution.id}/members/${memberId}`)
  }

  const handleAssignmentSubmit = async (input: {
    memberId: string
    requiredAmount: string
  }): Promise<boolean> => {
    const ok = editingAssignment
      ? await updateAssignment(editingAssignment.id, { requiredAmount: input.requiredAmount })
      : await createAssignment(input)
    if (ok) {
      refresh()
    }
    return ok
  }

  const handlePaymentSubmit = async (input: PaymentFormSubmitInput): Promise<boolean> => {
    const ok = await createPayment({
      contributionId: contribution.id,
      memberId: input.memberId,
      amount: input.amount,
      note: input.note,
      paidAt: input.paidAt,
    })
    if (ok) {
      refresh()
    }
    return ok
  }

  const handleExpenseSubmit = async (input: CreateExpenseInput): Promise<boolean> => {
    const ok = await createExpense({ ...input, contributionId: contribution.id })
    if (ok) {
      refresh()
    }
    return ok
  }

  const handleRemoveAssignment = async (): Promise<boolean> => {
    if (!removeTarget) return false
    const ok = await removeAssignment(removeTarget.id)
    if (ok) {
      refresh()
    }
    return ok
  }

  const handleAssignBulk = async (input: AssignBulkInput): Promise<boolean> => {
    const result = await assignBulkAction(input)
    if (result) {
      refreshAssignments()
      refresh()
    }
    return result !== null
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <button
          type="button"
          onClick={() =>
            contribution.recurringContributionId
              ? navigate(`/recurring-contributions/${contribution.recurringContributionId}`)
              : navigate("/contributions")
          }
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {contribution.recurringContributionId
            ? "Back to recurring contribution"
            : "Back to contributions"}
        </button>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{contribution.title}</h1>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  isTargeted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isTargeted ? "Targeted" : "Open"}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  contribution.status === "OPEN"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {contribution.status}
              </span>
            </div>
            {contribution.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{contribution.description}</p>
            ) : null}
          </div>
          {canUpdate || canRecordExpense ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {canRecordExpense ? (
                <Button variant="outline" onClick={openRecordExpense}>
                  <Receipt className="size-4" />
                  Record expense
                </Button>
              ) : null}
              {canUpdate && isOpen ? (
                <Button variant="outline" onClick={() => setCloseOpen(true)}>
                  <Lock className="size-4" />
                  Close
                </Button>
              ) : canUpdate ? (
                <Button variant="outline" onClick={() => void reopen()}>
                  <LockOpen className="size-4" />
                  Reopen
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {isTargeted ? (
            <SummaryCard label="Target" value={contribution.targetAmount ?? "0"} />
          ) : null}
          <SummaryCard label="Collected" value={contribution.totalCollected} />
          {isTargeted ? <SummaryCard label="Expected" value={contribution.totalRequired} /> : null}
          <SummaryCard label="Disbursed" value={contribution.totalDisbursed} />
          {isTargeted ? (
            <SummaryCard label="Outstanding" value={contribution.outstanding ?? "0"} />
          ) : null}
          <SummaryCard label="Net" value={contribution.net} emphasized />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {canAssign ? (
            <Button onClick={openAddAssignment}>
              <Plus className="size-4" />
              Add Assignment
            </Button>
          ) : null}
          {canAssign ? (
            <Button variant="outline" onClick={openAssignBulk}>
              <Layers className="size-4" />
              Assign multiple
            </Button>
          ) : null}
          {canRecordPayment ? (
            <Button onClick={() => openAddPayment()} variant="outline">
              <Plus className="size-4" />
              Record Payment
            </Button>
          ) : null}
        </div>

        {report ? (
          <ReportTable
            report={report}
            canAssign={canAssign}
            canRecordPayment={canRecordPayment}
            onEditAssignment={openEditAssignment}
            onAddPayment={openAddPayment}
            onRemoveAssignment={openRemoveAssignment}
            onViewDetails={viewDetails}
          />
        ) : null}
      </main>

      <AssignmentFormDialog
        key={`assignment-${assignmentFormKey}`}
        open={assignmentOpen}
        onOpenChange={setAssignmentOpen}
        assignment={editingAssignment}
        onSubmit={handleAssignmentSubmit}
      />
      <AssignBulkDialog
        key={`bulk-assign-${bulkAssignKey}`}
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
        existingAmounts={Object.fromEntries(
          assignments.map((assignment) => [assignment.memberId, assignment.requiredAmount])
        )}
        onSubmit={handleAssignBulk}
      />
      <PaymentFormDialog
        key={`payment-${paymentFormKey}`}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        payment={null}
        member={paymentMember}
        onSubmit={handlePaymentSubmit}
      />
      <ExpenseFormDialog
        key={`expense-${expenseFormKey}`}
        open={expenseOpen}
        onOpenChange={setExpenseOpen}
        expense={null}
        defaultContribution={{ id: contribution.id, title: contribution.title }}
        onSubmit={handleExpenseSubmit}
      />
      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveTarget(null)
          }
        }}
        title="Remove assignment?"
        description={`Remove the assignment for ${removeTarget?.memberName ?? "this member"}?`}
        confirmLabel="Remove"
        onConfirm={handleRemoveAssignment}
      />
      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Close contribution?"
        description={`This will close "${contribution.title}".`}
        confirmLabel="Close"
        onConfirm={close}
      />
    </div>
  )
}
