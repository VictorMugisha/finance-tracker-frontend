import { useState } from "react"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { formatMoney } from "@/utils/format"
import { useAssignments } from "../hooks/useAssignments"
import type { AssignmentDto } from "../types/assignment"
import AssignmentFormDialog from "./AssignmentFormDialog"

interface AssignmentsTabProps {
  contributionId: string
  onChanged: () => void
}

export default function AssignmentsTab({ contributionId, onChanged }: AssignmentsTabProps) {
  const { user } = useAuth()
  const { items, status, error, create, update, remove } = useAssignments(contributionId)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AssignmentDto | null>(null)
  const [removeTarget, setRemoveTarget] = useState<AssignmentDto | null>(null)

  const canWrite = user ? user.isAdmin || user.permissions.includes("assignments:write") : false

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (assignment: AssignmentDto) => {
    setEditing(assignment)
    setFormOpen(true)
  }

  const handleSubmit = async (input: { memberId: string; requiredAmount: string }) => {
    const ok = editing
      ? await update(editing.id, { requiredAmount: input.requiredAmount })
      : await create(input)
    if (ok) {
      onChanged()
    }
    return ok
  }

  const handleConfirmRemove = async () => {
    if (!removeTarget) {
      return false
    }
    const ok = await remove(removeTarget.id)
    if (ok) {
      onChanged()
    }
    return ok
  }

  if (status === "loading" && items.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {canWrite ? (
        <div>
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add assignment
          </Button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assignments yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((assignment) => (
            <li
              key={assignment.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{assignment.memberName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatMoney(assignment.requiredAmount)}
                </p>
              </div>
              {canWrite ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEdit(assignment)}
                    aria-label={`Edit ${assignment.memberName}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setRemoveTarget(assignment)}
                    aria-label={`Remove ${assignment.memberName}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <AssignmentFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        assignment={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveTarget(null)
          }
        }}
        title="Remove assignment?"
        description={`Remove the assignment for ${removeTarget?.memberName ?? ""}?`}
        confirmLabel="Remove"
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
