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
import { NumericInput } from "@/components/shared/NumericInput"
import { SearchableSelectDropdown } from "@/components/shared/SearchableSelectDropdown"
import { Textarea } from "@/components/ui/textarea"
import type { RecurringContributionDto, RecurringPeriod } from "../types/recurring"

const PERIODS: { value: RecurringPeriod; label: string }[] = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
]

export interface RecurringSubmitInput {
  title: string
  description: string | null
  period: RecurringPeriod
  targetAmount: string
}

interface RecurringContributionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recurring: RecurringContributionDto | null
  onSubmit: (input: RecurringSubmitInput) => Promise<boolean>
}

export default function RecurringContributionFormDialog({
  open,
  onOpenChange,
  recurring,
  onSubmit,
}: RecurringContributionFormDialogProps) {
  const [title, setTitle] = useState(recurring?.title ?? "")
  const [description, setDescription] = useState(recurring?.description ?? "")
  const [period, setPeriod] = useState<RecurringPeriod>(recurring?.period ?? "MONTHLY")
  const [targetAmount, setTargetAmount] = useState(recurring?.targetAmount ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = recurring !== null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      period,
      targetAmount: targetAmount.trim(),
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
          <DialogTitle>{isEdit ? "Edit recurring contribution" : "New recurring contribution"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Changes apply to future periods."
              : "A recurring contribution repeats each period; you roll it over manually."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="recurring-title">Title</Label>
            <Input
              id="recurring-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Monthly dues"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="recurring-description">Description</Label>
            <Textarea
              id="recurring-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Period</Label>
            <SearchableSelectDropdown
              options={PERIODS.map((option) => ({ value: option.value, label: option.label }))}
              value={period}
              onChange={(value) => setPeriod(value as RecurringPeriod)}
              searchPlaceholder="Search..."
              emptyMessage="No results found."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="recurring-target">Target amount (per period)</Label>
            <NumericInput
              id="recurring-target"
              value={targetAmount}
              onChange={setTargetAmount}
              placeholder="1000"
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
            <Button
              type="submit"
              disabled={isSubmitting || title.trim() === "" || targetAmount.trim() === ""}
            >
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
