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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [deadline, setDeadline] = useState(
    contribution?.deadline ? contribution.deadline.slice(0, 10) : ""
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
      deadline: deadline ? `${deadline}T00:00:00.000Z` : null,
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
            <Select
              value={type}
              onValueChange={(value) => setType(value as ContributionType)}
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TARGETED">Targeted</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === "TARGETED" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="contribution-target">Target amount</Label>
              <Input
                id="contribution-target"
                inputMode="decimal"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
                placeholder="1000"
                required
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="contribution-deadline">Deadline (optional)</Label>
            <Input
              id="contribution-deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
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
