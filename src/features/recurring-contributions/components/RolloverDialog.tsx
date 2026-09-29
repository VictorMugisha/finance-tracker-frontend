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

interface RolloverDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (label: string | null) => Promise<boolean>
}

export default function RolloverDialog({ open, onOpenChange, onSubmit }: RolloverDialogProps) {
  const [label, setLabel] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit(label.trim() || null)
    setIsSubmitting(false)
    if (ok) {
      setLabel("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Roll over to the next period</DialogTitle>
          <DialogDescription>
            Creates a new period and carries over the latest required amounts. Inactive members are
            skipped.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rollover-label">Period label (optional)</Label>
            <Input
              id="rollover-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. January 2026"
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Roll over"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
