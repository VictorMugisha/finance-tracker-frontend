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

interface RenamePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onSubmit: (title: string) => Promise<boolean>
}

export default function RenamePeriodDialog({
  open,
  onOpenChange,
  title,
  onSubmit,
}: RenamePeriodDialogProps) {
  const [value, setValue] = useState(title)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit(value.trim())
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename period</DialogTitle>
          <DialogDescription>Give this period its own distinct title.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rename-period-title">Title</Label>
            <Input
              id="rename-period-title"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="e.g. January 2026"
              required
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
            <Button type="submit" disabled={isSubmitting || value.trim() === ""}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
