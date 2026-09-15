import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MemberDto } from "../types/member"
import MemberActionsMenu from "./MemberActionsMenu"

interface MemberListProps {
  members: MemberDto[]
  canWrite: boolean
  onEdit: (member: MemberDto) => void
  onToggleActive: (member: MemberDto) => void
  onCreateUser?: (member: MemberDto) => void
}

export default function MemberList({
  members,
  canWrite,
  onEdit,
  onToggleActive,
  onCreateUser,
}: MemberListProps) {
  if (members.length === 0) {
    return <p className="text-sm text-muted-foreground">No members found.</p>
  }

  function renderActions(member: MemberDto) {
    if (!canWrite && !onCreateUser) {
      return null
    }
    return (
      <MemberActionsMenu
        member={member}
        onEdit={onEdit}
        onToggleActive={onToggleActive}
        onCreateUser={onCreateUser}
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
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.phone ?? "—"}</TableCell>
                <TableCell>{member.role ?? "—"}</TableCell>
                <TableCell>
                  {member.isActive ? (
                    <span className="text-sm text-muted-foreground">Active</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">{renderActions(member)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {members.map((member) => (
          <li key={member.id}>
            <Card>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {member.phone ?? "No phone"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm text-muted-foreground">
                      {member.role ?? "No role"}
                    </span>
                    {!member.isActive ? (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inactive
                      </span>
                    ) : null}
                  </div>
                  {renderActions(member)}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
