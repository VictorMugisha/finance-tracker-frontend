import { MoreVertical, Pencil, RotateCcw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MemberDto } from "../types/member"

interface MemberActionsMenuProps {
  member: MemberDto
  onEdit: (member: MemberDto) => void
  onToggleActive: (member: MemberDto) => void
}

export default function MemberActionsMenu({
  member,
  onEdit,
  onToggleActive,
}: MemberActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(member)}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleActive(member)}>
          {member.isActive ? <Trash2 className="size-4" /> : <RotateCcw className="size-4" />}
          {member.isActive ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
