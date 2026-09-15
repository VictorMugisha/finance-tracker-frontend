import { KeyRound, MoreVertical, Pencil, RotateCcw, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserDto } from "../types/user"

interface UserActionsMenuProps {
  user: UserDto
  canWrite: boolean
  canManagePermissions: boolean
  isSelf: boolean
  onEdit: (user: UserDto) => void
  onManagePermissions: (user: UserDto) => void
  onToggleActive: (user: UserDto) => void
}

export default function UserActionsMenu({
  user,
  canWrite,
  canManagePermissions,
  isSelf,
  onEdit,
  onManagePermissions,
  onToggleActive,
}: UserActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${user.name}`}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canWrite ? (
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
        ) : null}
        {canManagePermissions && !user.isAdmin ? (
          <DropdownMenuItem onClick={() => onManagePermissions(user)}>
            <KeyRound className="size-4" />
            Manage permissions
          </DropdownMenuItem>
        ) : null}
        {canWrite && !isSelf ? (
          <DropdownMenuItem onClick={() => onToggleActive(user)}>
            {user.isActive ? <UserX className="size-4" /> : <RotateCcw className="size-4" />}
            {user.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
