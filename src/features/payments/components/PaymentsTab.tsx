import { useState } from "react"
import { Loader2, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { formatMoney } from "@/utils/format"
import { usePayments } from "../hooks/usePayments"
import type { PaymentDto } from "../types/payment"
import PaymentFormDialog from "./PaymentFormDialog"

interface PaymentsTabProps {
  contributionId: string
  onChanged: () => void
}

export default function PaymentsTab({ contributionId, onChanged }: PaymentsTabProps) {
  const { user } = useAuth()
  const { items, status, error, create, update } = usePayments(contributionId)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentDto | null>(null)

  const canRecord = user ? user.isAdmin || user.permissions.includes("payments:record") : false
  const canUpdate = user ? user.isAdmin || user.permissions.includes("payments:update") : false

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (payment: PaymentDto) => {
    setEditing(payment)
    setFormOpen(true)
  }

  const handleSubmit = async (input: { memberId: string; amount: string; note: string | null }) => {
    const ok = editing
      ? await update(editing.id, { amount: input.amount, note: input.note })
      : await create({
          contributionId,
          memberId: input.memberId,
          amount: input.amount,
          note: input.note,
        })
    if (ok) {
      onChanged()
    }
    return ok
  }

  if (status === "loading" && items.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {canRecord ? (
        <div>
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Record payment
          </Button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((payment) => (
            <li
              key={payment.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{payment.memberName}</p>
                  <p className="font-medium">{formatMoney(payment.amount)}</p>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {new Date(payment.paidAt).toLocaleDateString()}
                  {payment.note ? ` · ${payment.note}` : ""}
                </p>
              </div>
              {canUpdate ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEdit(payment)}
                  aria-label={`Correct payment by ${payment.memberName}`}
                >
                  <Pencil className="size-4" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <PaymentFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        payment={editing}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
