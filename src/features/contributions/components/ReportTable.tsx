import { cn } from "cn"
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

export default function ReportTable({ report }: { report: ContributionReportResponse }) {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.memberId}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell className="text-right">{formatMoney(member.totalPaid)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
