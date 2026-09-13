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
import MemberSelect from "@/features/members/components/MemberSelect"
import type { PaymentDto } from "../types/payment"

interface PaymentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: PaymentDto | null
  onSubmit: (input: { memberId: string; amount: string; note: string | null }) => Promise<boolean>
}

export default function PaymentFormDialog({
  open,
  onOpenChange,
  payment,
  onSubmit,
}: PaymentFormDialogProps) {
  const [memberId, setMemberId] = useState(payment?.memberId ?? "")
  const [amount, setAmount] = useState(payment?.amount ?? "")
  const [note, setNote] = useState(payment?.note ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({
      memberId: memberId || payment?.memberId || "",
      amount: amount.trim(),
      note: note.trim() || null,
    })
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  const submitDisabled = payment ? amount.trim() === "" : memberId === "" || amount.trim() === ""

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
          {payment ? (
            <div className="flex flex-col gap-2">
              <Label>Member</Label>
              <p className="text-sm font-medium">{payment.memberName}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Member</Label>
              <MemberSelect value={memberId} onValueChange={setMemberId} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="payment-amount">Amount</Label>
            <Input
              id="payment-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="100"
              required
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
