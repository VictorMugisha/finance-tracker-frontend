import { Eye, Lock, MoreVertical, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ContributionDto } from "../types/contribution"

interface ContributionActionsMenuProps {
  contribution: ContributionDto
  onEdit: (contribution: ContributionDto) => void
  onViewReport: (contribution: ContributionDto) => void
  onClose: (contribution: ContributionDto) => void
}

export default function ContributionActionsMenu({
  contribution,
  onEdit,
  onViewReport,
  onClose,
}: ContributionActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${contribution.title}`}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewReport(contribution)}>
          <Eye className="size-4" />
          View Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(contribution)}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        {contribution.status === "OPEN" ? (
          <DropdownMenuItem onClick={() => onClose(contribution)}>
            <Lock className="size-4" />
            Close
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
