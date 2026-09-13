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
import { Label } from "@/components/ui/label"
import { NumericInput } from "@/components/shared/NumericInput"
import MemberSelect from "@/features/members/components/MemberSelect"
import type { AssignmentDto } from "../types/assignment"

interface AssignmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: AssignmentDto | null
  onSubmit: (input: { memberId: string; requiredAmount: string }) => Promise<boolean>
}

export default function AssignmentFormDialog({
  open,
  onOpenChange,
  assignment,
  onSubmit,
}: AssignmentFormDialogProps) {
  const [memberId, setMemberId] = useState(assignment?.memberId ?? "")
  const [requiredAmount, setRequiredAmount] = useState(assignment?.requiredAmount ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({
      memberId: memberId || assignment?.memberId || "",
      requiredAmount: requiredAmount.trim(),
    })
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  const submitDisabled = assignment
    ? requiredAmount.trim() === ""
    : memberId === "" || requiredAmount.trim() === ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{assignment ? "Edit assignment" : "Add assignment"}</DialogTitle>
          <DialogDescription>
            {assignment
              ? "Update the required amount for this member."
              : "Set a required amount for a member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {assignment ? (
            <div className="flex flex-col gap-2">
              <Label>Member</Label>
              <p className="text-sm font-medium">{assignment.memberName}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Member</Label>
              <MemberSelect value={memberId} onValueChange={setMemberId} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="assignment-amount">Required amount</Label>
            <NumericInput
              id="assignment-amount"
              value={requiredAmount}
              onChange={setRequiredAmount}
              placeholder="500"
              decimals={2}
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
              ) : assignment ? (
                "Save"
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
