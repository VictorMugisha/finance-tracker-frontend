import { useState } from "react"
import { ArrowLeft, Loader2, Lock, Plus } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useAssignments } from "@/features/assignments/hooks/useAssignments"
import type { AssignmentDto } from "@/features/assignments/types/assignment"
import AssignmentFormDialog from "@/features/assignments/components/AssignmentFormDialog"
import { usePaymentActions } from "@/features/payments/hooks/usePayments"
import PaymentFormDialog from "@/features/payments/components/PaymentFormDialog"
import type { PaymentFormSubmitInput } from "@/features/payments/components/PaymentFormDialog"
import { formatMoney } from "@/utils/format"
import ReportTable from "./components/ReportTable"
import { useContributionDetail } from "./hooks/useContributionDetail"

export default function ContributionDetailPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { contribution, report, status, refresh, close } = useContributionDetail(id)
  const {
    items: assignments,
    create: createAssignment,
    update: updateAssignment,
    remove: removeAssignment,
  } = useAssignments(id)
  const { create: createPayment } = usePaymentActions()

  const [closeOpen, setCloseOpen] = useState(false)
  const [assignmentOpen, setAssignmentOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<AssignmentDto | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMember, setPaymentMember] = useState<{ id: string; name: string } | null>(null)
  const [removeTarget, setRemoveTarget] = useState<AssignmentDto | null>(null)

  const has = (key: string) => (user ? user.isAdmin || user.permissions.includes(key) : false)
  const canUpdate = has("contributions:update")

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
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
  const canRecordPayment = isOpen && has("payments:record")

  const memberName = (memberId: string): string =>
    report?.members.find((member) => member.memberId === memberId)?.name ?? ""

  const findAssignment = (memberId: string): AssignmentDto | undefined =>
    assignments.find((assignment) => assignment.memberId === memberId)

  const openAddAssignment = () => {
    setEditingAssignment(null)
    setAssignmentOpen(true)
  }

  const openEditAssignment = (memberId: string) => {
    const assignment = findAssignment(memberId)
    if (!assignment) return
    setEditingAssignment(assignment)
    setAssignmentOpen(true)
  }

  const openRemoveAssignment = (memberId: string) => {
    const assignment = findAssignment(memberId)
    if (!assignment) return
    setRemoveTarget(assignment)
  }

  const openAddPayment = (memberId?: string) => {
    setPaymentMember(memberId ? { id: memberId, name: memberName(memberId) } : null)
    setPaymentOpen(true)
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

  const handleRemoveAssignment = async (): Promise<boolean> => {
    if (!removeTarget) return false
    const ok = await removeAssignment(removeTarget.id)
    if (ok) {
      refresh()
    }
    return ok
  }

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
          {canUpdate && isOpen ? (
            <Button variant="outline" onClick={() => setCloseOpen(true)}>
              <Lock className="size-4" />
              Close
            </Button>
          ) : null}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Collected</p>
            <p className="text-lg font-semibold">{formatMoney(contribution.totalCollected)}</p>
          </div>
          {isTargeted ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Required</p>
              <p className="text-lg font-semibold">{formatMoney(contribution.totalRequired)}</p>
            </div>
          ) : null}
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="text-lg font-semibold">{formatMoney(contribution.net)}</p>
          </div>
          {isTargeted && contribution.targetAmount ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="text-lg font-semibold">{formatMoney(contribution.targetAmount)}</p>
            </div>
          ) : null}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {canAssign ? (
            <Button onClick={openAddAssignment}>
              <Plus className="size-4" />
              Add Assignment
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
        key={editingAssignment?.id ?? "new"}
        open={assignmentOpen}
        onOpenChange={setAssignmentOpen}
        assignment={editingAssignment}
        onSubmit={handleAssignmentSubmit}
      />
      <PaymentFormDialog
        key={paymentMember?.id ?? "new"}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        payment={null}
        member={paymentMember}
        onSubmit={handlePaymentSubmit}
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
