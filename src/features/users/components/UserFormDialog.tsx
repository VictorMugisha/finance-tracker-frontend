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
import PasswordInput from "@/components/shared/PasswordInput"
import { SearchableSelectDropdown } from "@/components/shared/SearchableSelectDropdown"
import { useMembersOptions } from "@/features/members/hooks/useMembersOptions"
import type { UserDto } from "../types/user"

export interface UserFormSubmitInput {
  name: string
  phone: string
  memberId: string | null
  password: string | null
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserDto | null
  presetMember?: { id: string; name: string; phone: string | null } | null
  onSubmit: (input: UserFormSubmitInput) => Promise<boolean>
}

export default function UserFormDialog({
  open,
  onOpenChange,
  user,
  presetMember,
  onSubmit,
}: UserFormDialogProps) {
  const { members } = useMembersOptions()

  const [name, setName] = useState(user?.name ?? presetMember?.name ?? "")
  const [phone, setPhone] = useState(user?.phone ?? presetMember?.phone ?? "")
  const [memberId, setMemberId] = useState(user?.memberId ?? presetMember?.id ?? "")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCreate = user === null
  const PHONE_REGEX = /^07\d{8}$/
  const phoneError = phone.trim() !== "" && !PHONE_REGEX.test(phone.trim())

  const memberOptions = [
    { value: "none", label: "No member" },
    ...members.map((member) => ({
      value: member.id,
      label: member.name,
      subtitleLines: member.phone ? [{ key: "Phone", value: member.phone }] : [],
    })),
  ]

  const handleMemberChange = (value: string) => {
    if (value === "none") {
      setMemberId("")
      return
    }
    const member = members.find((item) => item.id === value)
    setMemberId(value)
    if (member) {
      setName(member.name)
      if (member.phone) {
        setPhone(member.phone)
      }
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const ok = await onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      memberId: memberId || null,
      password: password || null,
    })
    setIsSubmitting(false)
    if (ok) {
      onOpenChange(false)
    }
  }

  const submitDisabled =
    name.trim() === "" || phone.trim() === "" || phoneError || (isCreate && password === "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Add user" : "Edit user"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Create a user account. Optionally link it to a member."
              : "Update this user's details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Member (optional)</Label>
            <SearchableSelectDropdown
              options={memberOptions}
              value={memberId || "none"}
              onChange={handleMemberChange}
              searchPlaceholder="Search members..."
              emptyMessage="No members found"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-phone">Phone</Label>
            <Input
              id="user-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="07XXXXXXXX"
              pattern="^07\d{8}$"
              title="Phone must be 10 digits starting with 07"
              aria-invalid={phoneError || undefined}
            />
            {phoneError ? (
              <p className="text-xs text-destructive">Phone must be 10 digits starting with 07</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-password">{isCreate ? "Password" : "Password (optional)"}</Label>
            <PasswordInput
              id="user-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isCreate ? "Set a password" : "Leave blank to keep current"}
              autoComplete="new-password"
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
              ) : isCreate ? (
                "Add user"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
