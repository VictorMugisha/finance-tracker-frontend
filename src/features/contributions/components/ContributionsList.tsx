import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "cn"
import { formatMoney } from "@/utils/format"
import type { ContributionDto } from "../types/contribution"
import ContributionActionsMenu from "./ContributionActionsMenu"

interface ContributionsListProps {
  contributions: ContributionDto[]
  canWrite: boolean
  onEdit: (contribution: ContributionDto) => void
  onViewReport: (contribution: ContributionDto) => void
  onClose: (contribution: ContributionDto) => void
}

function TypeBadge({ type }: { type: ContributionDto["type"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        type === "TARGETED" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}
    >
      {type === "TARGETED" ? "Targeted" : "Open"}
    </span>
  )
}

function StatusBadge({ status }: { status: ContributionDto["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        status === "OPEN" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
      )}
    >
      {status === "OPEN" ? "Open" : "Closed"}
    </span>
  )
}

export default function ContributionsList({
  contributions,
  canWrite,
  onEdit,
  onViewReport,
  onClose,
}: ContributionsListProps) {
  if (contributions.length === 0) {
    return <p className="text-sm text-muted-foreground">No contributions found.</p>
  }

  function renderActions(contribution: ContributionDto) {
    if (!canWrite) {
      return null
    }
    return (
      <ContributionActionsMenu
        contribution={contribution}
        onEdit={onEdit}
        onViewReport={onViewReport}
        onClose={onClose}
      />
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Collected</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => (
              <TableRow
                key={contribution.id}
                className="cursor-pointer"
                onClick={() => onViewReport(contribution)}
              >
                <TableCell className="font-medium">{contribution.title}</TableCell>
                <TableCell>
                  <TypeBadge type={contribution.type} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={contribution.status} />
                </TableCell>
                <TableCell>{formatMoney(contribution.totalCollected)}</TableCell>
                <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                  {renderActions(contribution)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {contributions.map((contribution) => (
          <li key={contribution.id}>
            <Card className="cursor-pointer" onClick={() => onViewReport(contribution)}>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{contribution.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {formatMoney(contribution.totalCollected)}
                  </p>
                </div>
                <div
                  className="flex shrink-0 items-center gap-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex flex-col items-end gap-1">
                    <TypeBadge type={contribution.type} />
                    <StatusBadge status={contribution.status} />
                  </div>
                  {renderActions(contribution)}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
