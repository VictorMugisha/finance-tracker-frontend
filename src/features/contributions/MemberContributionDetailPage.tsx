import { useState } from "react"
import { ArrowLeft, Loader2, Pencil, Plus } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { format } from "date-fns"
import AppHeader from "@/components/shared/AppHeader"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useAssignments } from "@/features/assignments/hooks/useAssignments"
import AssignmentFormDialog from "@/features/assignments/components/AssignmentFormDialog"
import { usePayments } from "@/features/payments/hooks/usePayments"
import PaymentFormDialog from "@/features/payments/components/PaymentFormDialog"
import type { PaymentFormSubmitInput } from "@/features/payments/components/PaymentFormDialog"
import type { PaymentDto } from "@/features/payments/types/payment"
import { useRemountKey } from "@/hooks/useRemountKey"
import { formatMoney } from "@/utils/format"
import { useContributionDetail } from "./hooks/useContributionDetail"
import type { OpenMemberReportItem, TargetedMemberReportItem } from "./types/contribution"

export default function MemberContributionDetailPage() {
  const { contributionId = "", memberId = "" } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { contribution, report, status, refresh } = useContributionDetail(contributionId)
  const { items: assignments, update: updateAssignment } = useAssignments(contributionId)
  const {
    items: payments,
    status: paymentsStatus,
    create: createPayment,
    update: updatePayment,
  } = usePayments({ contributionId, memberId })

  const [assignmentOpen, setAssignmentOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<PaymentDto | null>(null)
  const { key: assignmentFormKey, remount: remountAssignmentForm } = useRemountKey()
  const { key: addPaymentFormKey, remount: remountAddPaymentForm } = useRemountKey()
  const { key: correctPaymentFormKey, remount: remountCorrectPaymentForm } = useRemountKey()

  const has = (key: string) => (user ? user.isAdmin || user.permissions.includes(key) : false)

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
  const canEditAssignment = isTargeted && isOpen && has("assignments:write")
  const canRecordPayment = has("payments:record")
  const canUpdatePayment = has("payments:update")

  const memberEntry = report?.members.find((member) => member.memberId === memberId)
  const memberName = memberEntry?.name ?? payments[0]?.memberName ?? "Member"
  const assignment = assignments.find((item) => item.memberId === memberId)

  const openCorrectPayment = (payment: PaymentDto) => {
    setEditingPayment(payment)
    remountCorrectPaymentForm()
  }

  const openEditAssignment = () => {
    remountAssignmentForm()
    setAssignmentOpen(true)
  }

  const openAddPayment = () => {
    remountAddPaymentForm()
    setPaymentOpen(true)
  }

  const handleAssignmentSubmit = async (input: {
    memberId: string
    requiredAmount: string
  }): Promise<boolean> => {
    if (!assignment) return false
    const ok = await updateAssignment(assignment.id, { requiredAmount: input.requiredAmount })
    if (ok) {
      refresh()
    }
    return ok
  }

  const handlePaymentSubmit = async (input: PaymentFormSubmitInput): Promise<boolean> => {
    const ok = await createPayment({
      contributionId,
      memberId,
      amount: input.amount,
      note: input.note,
      paidAt: input.paidAt,
    })
    if (ok) {
      refresh()
    }
    return ok
  }

  const handleCorrectPayment = async (input: PaymentFormSubmitInput): Promise<boolean> => {
    if (!editingPayment) return false
    const ok = await updatePayment(editingPayment.id, {
      amount: input.amount,
      note: input.note,
      paidAt: input.paidAt,
    })
    if (ok) {
      refresh()
    }
    return ok
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">
        <button
          type="button"
          onClick={() => navigate(`/contributions/${contributionId}`)}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to contribution
        </button>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{memberName}</h1>
            <p className="text-sm text-muted-foreground">{contribution.title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canEditAssignment && assignment ? (
              <Button onClick={openEditAssignment}>
                <Pencil className="size-4" />
                Edit Assignment
              </Button>
            ) : null}
            {canRecordPayment ? (
              <Button variant="outline" onClick={openAddPayment}>
                <Plus className="size-4" />
                Add Payment
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {isTargeted && memberEntry ? (
            <>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Required</p>
                <p className="text-lg font-semibold">
                  {formatMoney((memberEntry as TargetedMemberReportItem).required)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-lg font-semibold">
                  {formatMoney((memberEntry as TargetedMemberReportItem).paid)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-lg font-semibold">
                  {formatMoney((memberEntry as TargetedMemberReportItem).balance)}
                </p>
              </div>
            </>
          ) : memberEntry ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-lg font-semibold">
                {formatMoney((memberEntry as OpenMemberReportItem).totalPaid)}
              </p>
            </div>
          ) : null}
        </div>

        <h2 className="mb-2 text-base font-semibold">Payment history</h2>
        {paymentsStatus === "loading" && payments.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="font-medium">{formatMoney(payment.amount)}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {format(new Date(payment.paidAt), "dd/MM/yyyy")}
                    {payment.note ? ` · ${payment.note}` : ""}
                  </p>
                </div>
                {canUpdatePayment ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openCorrectPayment(payment)}
                    aria-label="Correct payment"
                  >
                    <Pencil className="size-4" />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </main>

      {canEditAssignment && assignment ? (
        <AssignmentFormDialog
          key={`assignment-${assignmentFormKey}`}
          open={assignmentOpen}
          onOpenChange={setAssignmentOpen}
          assignment={assignment}
          onSubmit={handleAssignmentSubmit}
        />
      ) : null}
      <PaymentFormDialog
        key={`payment-add-${addPaymentFormKey}`}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        payment={null}
        member={{ id: memberId, name: memberName }}
        onSubmit={handlePaymentSubmit}
      />
      <PaymentFormDialog
        key={`payment-correct-${correctPaymentFormKey}`}
        open={editingPayment !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingPayment(null)
          }
        }}
        payment={editingPayment}
        onSubmit={handleCorrectPayment}
      />
    </div>
  )
}
