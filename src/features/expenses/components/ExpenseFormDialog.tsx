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
import { SearchableSelectDropdown } from "@/components/shared/SearchableSelectDropdown"
import { useContributionsOptions } from "@/features/contributions/hooks/useContributionsOptions"
import { useMembersOptions } from "@/features/members/hooks/useMembersOptions"
import {
  EXPENSE_TYPE_LABELS,
  EXPENSE_TYPES,
  type CreateExpenseInput,
  type ExpenseDto,
  type ExpenseType,
} from "../types/expense"

interface ExpenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: ExpenseDto | null
  onSubmit: (input: CreateExpenseInput) => Promise<boolean>
}

export default function ExpenseFormDialog({
  open,
  onOpenChange,
  expense,
  onSubmit,
}: ExpenseFormDialogProps) {
  const { contributions, canRead: canReadContributions } = useContributionsOptions()
  const { members } = useMembersOptions()

  const [type, setType] = useState<ExpenseType>(expense?.type ?? "OTHER")
  const [amount, setAmount] = useState(expense?.amount ?? "")
  const [contributionId, setContributionId] = useState(expense?.contributionId ?? "")
  const [recipientMemberId, setRecipientMemberId] = useState(expense?.recipientMemberId ?? "")
  const [description, setDescription] = useState(expense?.description ?? "")
  const [spentAt, setSpentAt] = useState<Date>(
    expense?.spentAt ? new Date(expense.spentAt) : new Date()
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const typeOptions = EXPENSE_TYPES.map((value) => ({
    value,
    label: EXPENSE_TYPE_LABELS[value],
  }))

  const contributionOptions = [
    { value: "none", label: "No contribution" },
    ...contributions.map((contribution) => ({
      value: contribution.id,
      label: contribution.title,
    })),
  ]

  const memberOptions = [
    { value: "none", label: "No recipient" },
    ...members.map((member) => ({ value: member.id, label: member.name })),
  ]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({
      contributionId: contributionId || null,
      type,
      amount: amount.trim(),
      recipientMemberId: type === "MEMBER_SUPPORT" ? recipientMemberId || null : null,
      description: description.trim() || null,
      spentAt: spentAt.toISOString(),
    })
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit expense" : "Record expense"}</DialogTitle>
          <DialogDescription>
            {expense
              ? "Correct the details of this expense."
              : "Record money going out of the group."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <SearchableSelectDropdown
              options={typeOptions}
              value={type}
              onChange={(value) => {
                const nextType = value as ExpenseType
                setType(nextType)
                if (nextType !== "MEMBER_SUPPORT") {
                  setRecipientMemberId("")
                }
              }}
              searchPlaceholder="Search..."
              emptyMessage="No results found."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-amount">Amount</Label>
            <NumericInput
              id="expense-amount"
              value={amount}
              onChange={setAmount}
              placeholder="100"
              decimals={2}
            />
          </div>
          {canReadContributions ? (
            <div className="flex flex-col gap-2">
              <Label>Contribution (optional)</Label>
              <SearchableSelectDropdown
                options={contributionOptions}
                value={contributionId || "none"}
                onChange={(value) => setContributionId(value === "none" ? "" : value)}
                searchPlaceholder="Search..."
                emptyMessage="No results found."
              />
            </div>
          ) : null}
          {type === "MEMBER_SUPPORT" ? (
            <div className="flex flex-col gap-2">
              <Label>Recipient member</Label>
              <SearchableSelectDropdown
                options={memberOptions}
                value={recipientMemberId || "none"}
                onChange={(value) => setRecipientMemberId(value === "none" ? "" : value)}
                searchPlaceholder="Search members..."
                emptyMessage="No members found"
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-description">Description (optional)</Label>
            <Input
              id="expense-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Handed over to treasurer"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-date">Date</Label>
            <DatePicker
              id="expense-date"
              value={spentAt}
              onChange={(date) => setSpentAt(date ?? new Date())}
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
            <Button type="submit" disabled={isSubmitting || amount.trim() === ""}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : expense ? (
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
