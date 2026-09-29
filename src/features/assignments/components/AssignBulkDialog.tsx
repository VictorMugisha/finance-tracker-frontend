import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Loader2, TriangleAlert } from "lucide-react"
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
import { useMembersOptions } from "@/features/members/hooks/useMembersOptions"
import { formatMoney } from "@/utils/format"
import type { AssignBulkInput } from "../types/assignment"

interface AssignBulkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingAmounts: Record<string, string>
  onSubmit: (input: AssignBulkInput) => Promise<boolean>
}

export default function AssignBulkDialog({
  open,
  onOpenChange,
  existingAmounts,
  onSubmit,
}: AssignBulkDialogProps) {
  const { members, isLoading } = useMembersOptions()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [amount, setAmount] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredMembers = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (normalized === "") {
      return members
    }
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(normalized) ||
        (member.phone ?? "").toLowerCase().includes(normalized)
    )
  }, [members, search])

  const overwriteCount = selectedIds.filter((id) => existingAmounts[id] !== undefined).length

  const toggleMember = (memberId: string) => {
    setSelectedIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    )
    setConfirming(false)
  }

  const selectAll = () => {
    setSelectedIds(members.map((member) => member.id))
    setConfirming(false)
  }

  const clearAll = () => {
    setSelectedIds([])
    setConfirming(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (overwriteCount > 0 && !confirming) {
      setConfirming(true)
      return
    }
    setIsSubmitting(true)
    const ok = await onSubmit({ memberIds: selectedIds, amount: amount.trim() })
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  const submitDisabled = selectedIds.length === 0 || amount.trim() === ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign multiple members</DialogTitle>
          <DialogDescription>
            Set the same required amount for several members — new or existing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Members</Label>
            <Input
              type="search"
              placeholder="Search members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedIds.length} member{selectedIds.length === 1 ? "" : "s"} selected
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                >
                  Select all
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="flex max-h-[40vh] flex-col gap-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredMembers.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No members found.
                </p>
              ) : (
                filteredMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="size-6 accent-primary"
                    />
                    <span className="min-w-0 text-sm">
                      <span className="font-medium">{member.name}</span>
                      {member.phone ? (
                        <span className="block text-xs text-muted-foreground">{member.phone}</span>
                      ) : null}
                      {existingAmounts[member.id] !== undefined ? (
                        <span className="block text-xs font-medium text-muted-foreground">
                          Current: {formatMoney(existingAmounts[member.id])}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bulk-amount">Required amount</Label>
            <NumericInput
              id="bulk-amount"
              value={amount}
              onChange={setAmount}
              placeholder="500"
              decimals={2}
            />
          </div>
          {overwriteCount > 0 ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <span>
                This will overwrite the existing required amount for {overwriteCount} member
                {overwriteCount === 1 ? "" : "s"}.
              </span>
            </div>
          ) : null}
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
              disabled={isSubmitting || submitDisabled}
              variant={overwriteCount > 0 && confirming ? "destructive" : "default"}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : overwriteCount > 0 && confirming ? (
                "Apply anyway"
              ) : (
                "Assign"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
