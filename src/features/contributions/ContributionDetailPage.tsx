import { useState } from "react"
import { ArrowLeft, Loader2, Lock } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AssignmentsTab from "@/features/assignments/components/AssignmentsTab"
import PaymentsTab from "@/features/payments/components/PaymentsTab"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { cn } from "cn"
import { formatMoney } from "@/utils/format"
import ReportTable from "./components/ReportTable"
import { useContributionDetail } from "./hooks/useContributionDetail"

export default function ContributionDetailPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { contribution, report, status, refresh, close } = useContributionDetail(id)
  const [closeOpen, setCloseOpen] = useState(false)

  const canUpdate = user ? user.isAdmin || user.permissions.includes("contributions:update") : false

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!contribution) {
    return (
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">Contribution not found.</p>
        </div>
      </div>
    )
  }

  const isTargeted = contribution.type === "TARGETED"

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <button
          type="button"
          onClick={() => navigate("/contributions")}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to contributions
        </button>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{contribution.title}</h1>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  isTargeted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isTargeted ? "Targeted" : "Open"}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  contribution.status === "OPEN"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {contribution.status}
              </span>
            </div>
            {contribution.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{contribution.description}</p>
            ) : null}
          </div>
          {canUpdate && contribution.status === "OPEN" ? (
            <Button variant="outline" onClick={() => setCloseOpen(true)}>
              <Lock className="size-4" />
              Close
            </Button>
          ) : null}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Collected</p>
            <p className="text-lg font-semibold">{formatMoney(contribution.totalCollected)}</p>
          </div>
          {isTargeted ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Required</p>
              <p className="text-lg font-semibold">{formatMoney(contribution.totalRequired)}</p>
            </div>
          ) : null}
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="text-lg font-semibold">{formatMoney(contribution.net)}</p>
          </div>
          {isTargeted && contribution.targetAmount ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="text-lg font-semibold">{formatMoney(contribution.targetAmount)}</p>
            </div>
          ) : null}
        </div>

        <Tabs defaultValue="report">
          <TabsList>
            <TabsTrigger value="report">Report</TabsTrigger>
            {isTargeted ? <TabsTrigger value="assignments">Assignments</TabsTrigger> : null}
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="report">
            {report ? <ReportTable report={report} /> : null}
          </TabsContent>
          {isTargeted ? (
            <TabsContent value="assignments">
              <AssignmentsTab contributionId={contribution.id} onChanged={refresh} />
            </TabsContent>
          ) : null}
          <TabsContent value="payments">
            <PaymentsTab contributionId={contribution.id} onChanged={refresh} />
          </TabsContent>
        </Tabs>
      </main>

      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Close contribution?"
        description={`This will close "${contribution.title}".`}
        confirmLabel="Close"
        onConfirm={close}
      />
    </div>
  )
}
