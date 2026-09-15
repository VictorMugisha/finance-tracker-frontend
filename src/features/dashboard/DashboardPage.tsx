import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  Plus,
  Receipt,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react"
import { Link } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { fetchBalance } from "@/features/contributions/slice/contributionsSlice"
import { useExpenseActions } from "@/features/expenses/hooks/useExpenses"
import ExpenseFormDialog from "@/features/expenses/components/ExpenseFormDialog"
import type { CreateExpenseInput } from "@/features/expenses/types/expense"
import { useStats } from "@/features/stats/hooks/useStats"
import { useRemountKey } from "@/hooks/useRemountKey"
import { formatMoney } from "@/utils/format"

interface StatCardProps {
  icon: ReactNode
  label: string
  value: number
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-lg font-semibold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const balance = useAppSelector((state) => state.contributions.balance)
  const hasReports = user ? user.isAdmin || user.permissions.includes("reports:view") : false
  const canRecord = user ? user.isAdmin || user.permissions.includes("expenses:record") : false

  const { stats, refresh: refreshStats } = useStats(hasReports)
  const { create: createExpense } = useExpenseActions()

  const [showTotals, setShowTotals] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const { key: expenseFormKey, remount: remountExpenseForm } = useRemountKey()

  useEffect(() => {
    if (hasReports) {
      void dispatch(fetchBalance())
    }
  }, [dispatch, hasReports])

  const openRecordExpense = () => {
    remountExpenseForm()
    setExpenseOpen(true)
  }

  const handleExpenseSubmit = async (input: CreateExpenseInput) => {
    const ok = await createExpense(input)
    if (ok && hasReports) {
      void dispatch(fetchBalance())
      refreshStats()
    }
    return ok
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Welcome back{user ? `, ${user.name}` : ""}</h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening in your group.
            </p>
          </div>
          {canRecord ? (
            <Button onClick={openRecordExpense}>
              <Plus className="size-4" />
              Record expense
            </Button>
          ) : null}
        </div>

        {hasReports && balance ? (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Group balance</CardTitle>
                <CardDescription>Total collected minus total disbursed</CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setShowTotals((value) => !value)}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {showTotals ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                {showTotals ? "Hide totals" : "Show totals"}
              </button>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{formatMoney(balance.balance)}</p>
              <p className="text-xs text-muted-foreground">Available balance</p>
              {showTotals ? (
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t pt-4">
                  <div>
                    <p className="text-lg font-medium">{formatMoney(balance.totalCollected)}</p>
                    <p className="text-xs text-muted-foreground">Collected</p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">{formatMoney(balance.totalDisbursed)}</p>
                    <p className="text-xs text-muted-foreground">Disbursed</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {hasReports && stats ? (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatCard icon={<Users className="size-4" />} label="Members" value={stats.members} />
            <StatCard icon={<UserCheck className="size-4" />} label="Users" value={stats.users} />
            <StatCard
              icon={<Wallet className="size-4" />}
              label="Contributions"
              value={stats.contributions}
            />
            <StatCard
              icon={<Banknote className="size-4" />}
              label="Payments"
              value={stats.payments}
            />
            <StatCard
              icon={<Receipt className="size-4" />}
              label="Expenses"
              value={stats.expenses}
            />
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/members" className="group">
            <Card className="transition-colors group-hover:bg-muted">
              <CardContent className="flex items-center gap-3 p-4">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Members</p>
                  <p className="text-sm text-muted-foreground">Manage group participants</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/contributions" className="group">
            <Card className="transition-colors group-hover:bg-muted">
              <CardContent className="flex items-center gap-3 p-4">
                <Wallet className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Contributions</p>
                  <p className="text-sm text-muted-foreground">View rounds and reports</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/expenses" className="group">
            <Card className="transition-colors group-hover:bg-muted">
              <CardContent className="flex items-center gap-3 p-4">
                <Receipt className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Expenses</p>
                  <p className="text-sm text-muted-foreground">Track group spending</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      <ExpenseFormDialog
        key={expenseFormKey}
        open={expenseOpen}
        onOpenChange={setExpenseOpen}
        expense={null}
        onSubmit={handleExpenseSubmit}
      />
    </div>
  )
}
