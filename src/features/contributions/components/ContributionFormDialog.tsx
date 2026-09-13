import { useState } from "react"
import type { FormEvent } from "react"
import { format } from "date-fns"
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
import { Textarea } from "@/components/ui/textarea"
import type {
  ContributionDto,
  ContributionType,
  CreateContributionInput,
} from "../types/contribution"

interface ContributionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contribution: ContributionDto | null
  onSubmit: (input: CreateContributionInput) => Promise<boolean>
}

export default function ContributionFormDialog({
  open,
  onOpenChange,
  contribution,
  onSubmit,
}: ContributionFormDialogProps) {
  const [title, setTitle] = useState(contribution?.title ?? "")
  const [description, setDescription] = useState(contribution?.description ?? "")
  const [type, setType] = useState<ContributionType>(contribution?.type ?? "TARGETED")
  const [targetAmount, setTargetAmount] = useState(contribution?.targetAmount ?? "")
  const [deadline, setDeadline] = useState<Date | undefined>(
    contribution?.deadline ? new Date(contribution.deadline) : undefined
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = contribution !== null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      type,
      targetAmount: type === "TARGETED" ? targetAmount.trim() || null : null,
      deadline: deadline ? `${format(deadline, "yyyy-MM-dd")}T00:00:00.000Z` : null,
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
          <DialogTitle>{isEdit ? "Edit contribution" : "New contribution"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this contribution's details." : "Start a new contribution round."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contribution-title">Title</Label>
            <Input
              id="contribution-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Monthly dues"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contribution-description">Description</Label>
            <Textarea
              id="contribution-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <SearchableSelectDropdown
              options={[
                { value: "TARGETED", label: "Targeted" },
                { value: "OPEN", label: "Open" },
              ]}
              value={type}
              onChange={(value) => setType(value as ContributionType)}
              disabled={isEdit}
              searchPlaceholder="Search..."
              emptyMessage="No results found."
            />
          </div>
          {type === "TARGETED" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="contribution-target">Target amount</Label>
              <NumericInput
                id="contribution-target"
                value={targetAmount}
                onChange={setTargetAmount}
                placeholder="1000"
                decimals={2}
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="contribution-deadline">Deadline (optional)</Label>
            <DatePicker id="contribution-deadline" value={deadline} onChange={setDeadline} />
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
            <Button type="submit" disabled={isSubmitting || title.trim() === ""}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEdit ? (
                "Save"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
