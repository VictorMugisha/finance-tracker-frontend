import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRemountKey } from "@/hooks/useRemountKey"
import UserFormDialog from "./components/UserFormDialog"
import type { UserFormSubmitInput } from "./components/UserFormDialog"
import UserPermissionsDialog from "./components/UserPermissionsDialog"
import UsersList from "./components/UsersList"
import { useUsers } from "./hooks/useUsers"
import type { UserDto } from "./types/user"

export default function UsersPage() {
  const { user } = useAuth()
  const { items, status, error, create, update, setPermissions } = useUsers()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<UserDto | null>(null)
  const [permissionsTarget, setPermissionsTarget] = useState<UserDto | null>(null)
  const { key: formKey, remount: remountForm } = useRemountKey()
  const { key: permissionsKey, remount: remountPermissions } = useRemountKey()

  const isAdmin = user?.isAdmin ?? false
  const canWrite = user ? user.isAdmin || user.permissions.includes("users:write") : false

  const openCreate = () => {
    setEditing(null)
    remountForm()
    setFormOpen(true)
  }

  const openEdit = (target: UserDto) => {
    setEditing(target)
    remountForm()
    setFormOpen(true)
  }

  const openPermissions = (target: UserDto) => {
    setPermissionsTarget(target)
    remountPermissions()
  }

  const handleSubmit = async (input: UserFormSubmitInput) => {
    if (editing) {
      return update(editing.id, {
        name: input.name,
        phone: input.phone,
        memberId: input.memberId,
        ...(input.password ? { password: input.password } : {}),
      })
    }
    if (!input.password) {
      return false
    }
    return create({
      name: input.name,
      phone: input.phone,
      memberId: input.memberId,
      password: input.password,
    })
  }

  const handleSetPermissions = async (permissions: string[]) => {
    if (!permissionsTarget) {
      return false
    }
    return setPermissions(permissionsTarget.id, permissions)
  }

  const handleToggleActive = (target: UserDto) => {
    void update(target.id, { isActive: !target.isActive })
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Users</h1>
          {canWrite ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add user
            </Button>
          ) : null}
        </div>

        {status === "loading" && items.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <UsersList
            users={items}
            canWrite={canWrite}
            canManagePermissions={isAdmin}
            currentUserId={user?.id}
            onEdit={openEdit}
            onManagePermissions={openPermissions}
            onToggleActive={handleToggleActive}
          />
        )}
      </main>

      <UserFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editing}
        onSubmit={handleSubmit}
      />
      <UserPermissionsDialog
        key={`permissions-${permissionsKey}`}
        open={permissionsTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPermissionsTarget(null)
          }
        }}
        user={permissionsTarget}
        onSubmit={handleSetPermissions}
      />
    </div>
  )
}
