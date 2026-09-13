import { useState } from "react"
import type { FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/shared/DatePicker"
import { NumericInput } from "@/components/shared/NumericInput"
import MemberSelect from "@/features/members/components/MemberSelect"
import type { PaymentDto } from "../types/payment"

export interface PaymentFormSubmitInput {
  memberId: string
  amount: string
  note: string | null
  paidAt: string
}

interface PaymentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: PaymentDto | null
  member?: { id: string; name: string } | null
  onSubmit: (input: PaymentFormSubmitInput) => Promise<boolean>
}

export default function PaymentFormDialog({
  open,
  onOpenChange,
  payment,
  member,
  onSubmit,
}: PaymentFormDialogProps) {
  const [memberId, setMemberId] = useState(payment?.memberId ?? member?.id ?? "")
  const [amount, setAmount] = useState(payment?.amount ?? "")
  const [note, setNote] = useState(payment?.note ?? "")
  const [paidAt, setPaidAt] = useState<Date>(
    payment?.paidAt ? new Date(payment.paidAt) : new Date()
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const effectiveMemberId = payment?.memberId ?? member?.id ?? memberId
  const fixedMemberName = payment?.memberName ?? member?.name

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({
      memberId: effectiveMemberId,
      amount: amount.trim(),
      note: note.trim() || null,
      paidAt: paidAt.toISOString(),
    })
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  const submitDisabled = amount.trim() === "" || effectiveMemberId === ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{payment ? "Correct payment" : "Record payment"}</DialogTitle>
          <DialogDescription>
            {payment ? "Fix a mistake on this payment." : "Record a deposit from a member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fixedMemberName ? (
            <div className="flex flex-col gap-2">
              <Label>Member</Label>
              <p className="text-sm font-medium">{fixedMemberName}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Member</Label>
              <MemberSelect value={memberId} onValueChange={setMemberId} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="payment-amount">Amount</Label>
            <NumericInput
              id="payment-amount"
              value={amount}
              onChange={setAmount}
              placeholder="100"
              decimals={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="payment-note">Note (optional)</Label>
            <Input
              id="payment-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="payment-date">Date</Label>
            <DatePicker
              id="payment-date"
              value={paidAt}
              onChange={(date) => setPaidAt(date ?? new Date())}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || submitDisabled}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : payment ? (
                "Save"
              ) : (
                "Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
