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
import type { CreateMemberInput, GroupRole, MemberDto } from "../types/member"

const ROLES: { value: GroupRole; label: string }[] = [
  { value: "LEADER", label: "Leader" },
  { value: "ASSISTANT", label: "Assistant" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "MEMBER", label: "Member" },
]

interface MemberFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: MemberDto | null
  onSubmit: (input: CreateMemberInput) => Promise<boolean>
}

export default function MemberFormDialog({
  open,
  onOpenChange,
  member,
  onSubmit,
}: MemberFormDialogProps) {
  const [name, setName] = useState(member?.name ?? "")
  const [phone, setPhone] = useState(member?.phone ?? "")
  const [role, setRole] = useState<GroupRole | null>(member?.role ?? null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({ name: name.trim(), phone: phone.trim() || null, role })
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{member ? "Edit member" : "Add member"}</DialogTitle>
          <DialogDescription>
            {member ? "Update this member's details." : "Add a new group participant."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="member-name">Name</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="member-phone">Phone</Label>
            <Input
              id="member-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="07XXXXXXXX"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Select
              value={role ?? "none"}
              onValueChange={(value) => setRole(value === "none" ? null : (value as GroupRole))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No role</SelectItem>
                {ROLES.map((roleOption) => (
                  <SelectItem key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="submit" disabled={isSubmitting || name.trim() === ""}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : member ? (
                "Save"
              ) : (
                "Add member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
