import { useEffect } from "react"
import { TrendingUp, Users, Wallet } from "lucide-react"
import { Link } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { fetchBalance } from "@/features/contributions/slice/contributionsSlice"
import { formatMoney } from "@/utils/format"

export default function DashboardPage() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const balance = useAppSelector((state) => state.contributions.balance)

  const hasReports = user ? user.isAdmin || user.permissions.includes("reports:view") : false

  useEffect(() => {
    if (hasReports) {
      void dispatch(fetchBalance())
    }
  }, [dispatch, hasReports])

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">
        <h1 className="text-xl font-semibold">Welcome back{user ? `, ${user.name}` : ""}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening in your group.
        </p>

        {hasReports && balance ? (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Group balance</CardTitle>
                <CardDescription>Total collected minus total disbursed</CardDescription>
              </div>
              <TrendingUp className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-x-8 gap-y-2">
              <div>
                <p className="text-2xl font-semibold">{formatMoney(balance.balance)}</p>
                <p className="text-xs text-muted-foreground">Balance</p>
              </div>
              <div>
                <p className="text-lg font-medium">{formatMoney(balance.totalCollected)}</p>
                <p className="text-xs text-muted-foreground">Collected</p>
              </div>
              <div>
                <p className="text-lg font-medium">{formatMoney(balance.totalDisbursed)}</p>
                <p className="text-xs text-muted-foreground">Disbursed</p>
              </div>
            </CardContent>
          </Card>
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
        </div>
      </main>
    </div>
  )
}
