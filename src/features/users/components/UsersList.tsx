import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { UserDto } from "../types/user"
import UserActionsMenu from "./UserActionsMenu"

interface UsersListProps {
  users: UserDto[]
  canWrite: boolean
  canManagePermissions: boolean
  currentUserId?: string
  onEdit: (user: UserDto) => void
  onManagePermissions: (user: UserDto) => void
  onToggleActive: (user: UserDto) => void
}

function AdminBadge() {
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      Admin
    </span>
  )
}

export default function UsersList({
  users,
  canWrite,
  canManagePermissions,
  currentUserId,
  onEdit,
  onManagePermissions,
  onToggleActive,
}: UsersListProps) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found.</p>
  }

  function renderActions(user: UserDto) {
    if (!canWrite && !canManagePermissions) {
      return null
    }
    return (
      <UserActionsMenu
        user={user}
        canWrite={canWrite}
        canManagePermissions={canManagePermissions}
        isSelf={currentUserId === user.id}
        onEdit={onEdit}
        onManagePermissions={onManagePermissions}
        onToggleActive={onToggleActive}
      />
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{user.name}</span>
                    {user.isAdmin ? <AdminBadge /> : null}
                  </span>
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.memberName ?? "External"}</TableCell>
                <TableCell>{user.isAdmin ? <AdminBadge /> : user.permissions.length}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <span className="text-sm text-muted-foreground">Active</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">{renderActions(user)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <li key={user.id}>
            <Card>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{user.name}</span>
                    {user.isAdmin ? <AdminBadge /> : null}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.phone} · {user.memberName ?? "External"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.isAdmin
                      ? "Admin"
                      : `${user.permissions.length} permission${user.permissions.length === 1 ? "" : "s"}`}
                    {!user.isActive ? " · Inactive" : ""}
                  </p>
                </div>
                {renderActions(user)}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
