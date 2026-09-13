import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/hooks/useAuth"
import MemberFormDialog from "./components/MemberFormDialog"
import MemberList from "./components/MemberList"
import { useMembers } from "./hooks/useMembers"
import type { CreateMemberInput, MemberDto } from "./types/member"

export default function MembersPage() {
  const { user } = useAuth()
  const { members, status, error, search, setSearch, create, update, deactivate } = useMembers()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MemberDto | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<MemberDto | null>(null)

  const canWrite = user ? user.isAdmin || user.permissions.includes("members:write") : false

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (member: MemberDto) => {
    setEditing(member)
    setFormOpen(true)
  }

  const handleSubmit = async (input: CreateMemberInput) => {
    return editing ? update(editing.id, input) : create(input)
  }

  const handleToggleActive = (member: MemberDto) => {
    if (member.isActive) {
      setConfirmTarget(member)
    } else {
      void update(member.id, { isActive: true })
    }
  }

  const handleConfirmDeactivate = async () => {
    if (!confirmTarget) {
      return false
    }
    return deactivate(confirmTarget.id)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Members</h1>
          {canWrite ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add member
            </Button>
          ) : null}
        </div>
        <Input
          type="search"
          placeholder="Search members..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mb-4"
        />
        {status === "loading" && members.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <MemberList
            members={members}
            canWrite={canWrite}
            onEdit={openEdit}
            onToggleActive={handleToggleActive}
          />
        )}
      </main>
      <MemberFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        member={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmTarget(null)
          }
        }}
        title="Deactivate member?"
        description={`This will deactivate ${confirmTarget?.name ?? "this member"}. They will no longer be shown as active.`}
        confirmLabel="Deactivate"
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  )
}
