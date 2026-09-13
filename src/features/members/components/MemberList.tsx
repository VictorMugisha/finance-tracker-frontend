import { Card, CardContent } from "@/components/ui/card"
import type { MemberDto } from "../types/member"

interface MemberListProps {
  members: MemberDto[]
}

export default function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return <p className="text-sm text-muted-foreground">No members found.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
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
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm text-muted-foreground">{member.role ?? "No role"}</span>
                {!member.isActive ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    Inactive
                  </span>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
