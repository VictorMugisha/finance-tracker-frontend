import { useState } from "react"
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
import { usePermissions } from "@/features/permissions/hooks/usePermissions"
import type { UserDto } from "../types/user"

interface UserPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserDto | null
  onSubmit: (permissions: string[]) => Promise<boolean>
}

export default function UserPermissionsDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserPermissionsDialogProps) {
  const { items: permissions, isLoading } = usePermissions()
  const [selected, setSelected] = useState<string[]>(user?.permissions ?? [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggle = (key: string) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    )
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    const ok = await onSubmit(selected)
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage permissions</DialogTitle>
          <DialogDescription>
            Choose what {user?.name ?? "this user"} is allowed to do.
          </DialogDescription>
        </DialogHeader>
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            permissions.map((permission) => (
              <label
                key={permission.key}
                className="flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(permission.key)}
                  onChange={() => toggle(permission.key)}
                  className="mt-0.5 size-4"
                />
                <span className="min-w-0 text-sm">
                  <span className="font-medium">{permission.key}</span>
                  <span className="block text-xs text-muted-foreground">
                    {permission.description}
                  </span>
                </span>
              </label>
            ))
          )}
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
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
