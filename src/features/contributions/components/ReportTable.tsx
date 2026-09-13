import { Eye, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatMoney } from "@/utils/format"
import type {
  ContributionReportResponse,
  OpenMemberReportItem,
  TargetedMemberReportItem,
} from "../types/contribution"

function balanceColor(balance: string): string {
  const value = Number(balance)
  if (value > 0) {
    return "text-emerald-600"
  }
  if (value < 0) {
    return "text-destructive"
  }
  return "text-muted-foreground"
}

interface MemberReportActionsMenuProps {
  memberId: string
  name: string
  canAssign: boolean
  canRecordPayment: boolean
  onEditAssignment: (memberId: string) => void
  onAddPayment: (memberId: string) => void
  onRemoveAssignment: (memberId: string) => void
  onViewDetails: (memberId: string) => void
}

function MemberReportActionsMenu({
  memberId,
  name,
  canAssign,
  canRecordPayment,
  onEditAssignment,
  onAddPayment,
  onRemoveAssignment,
  onViewDetails,
}: MemberReportActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${name}`}>
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(memberId)}>
          <Eye className="size-4" />
          View Details
        </DropdownMenuItem>
        {canRecordPayment ? (
          <DropdownMenuItem onClick={() => onAddPayment(memberId)}>
            <Plus className="size-4" />
            Add Payment
          </DropdownMenuItem>
        ) : null}
        {canAssign ? (
          <DropdownMenuItem onClick={() => onEditAssignment(memberId)}>
            <Pencil className="size-4" />
            Edit Assignment
          </DropdownMenuItem>
        ) : null}
        {canAssign ? (
          <DropdownMenuItem variant="destructive" onClick={() => onRemoveAssignment(memberId)}>
            <Trash2 className="size-4" />
            Remove Assignment
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ReportTableProps {
  report: ContributionReportResponse
  canAssign: boolean
  canRecordPayment: boolean
  onEditAssignment: (memberId: string) => void
  onAddPayment: (memberId: string) => void
  onRemoveAssignment: (memberId: string) => void
  onViewDetails: (memberId: string) => void
}

export default function ReportTable({
  report,
  canAssign,
  canRecordPayment,
  onEditAssignment,
  onAddPayment,
  onRemoveAssignment,
  onViewDetails,
}: ReportTableProps) {
  const isTargeted = report.contribution.type === "TARGETED"

  if (report.members.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>
  }

  if (isTargeted) {
    const members = report.members as TargetedMemberReportItem[]
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead className="text-right">Required</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.memberId}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell className="text-right">{formatMoney(member.required)}</TableCell>
              <TableCell className="text-right">{formatMoney(member.paid)}</TableCell>
              <TableCell className={cn("text-right font-medium", balanceColor(member.balance))}>
                {formatMoney(member.balance)}
              </TableCell>
              <TableCell className="text-right">
                <MemberReportActionsMenu
                  memberId={member.memberId}
                  name={member.name}
                  canAssign={canAssign}
                  canRecordPayment={canRecordPayment}
                  onEditAssignment={onEditAssignment}
                  onAddPayment={onAddPayment}
                  onRemoveAssignment={onRemoveAssignment}
                  onViewDetails={onViewDetails}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const members = report.members as OpenMemberReportItem[]
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead className="text-right">Total Paid</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.memberId}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell className="text-right">{formatMoney(member.totalPaid)}</TableCell>
            <TableCell className="text-right">
              <MemberReportActionsMenu
                memberId={member.memberId}
                name={member.name}
                canAssign={canAssign}
                canRecordPayment={canRecordPayment}
                onEditAssignment={onEditAssignment}
                onAddPayment={onAddPayment}
                onRemoveAssignment={onRemoveAssignment}
                onViewDetails={onViewDetails}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
