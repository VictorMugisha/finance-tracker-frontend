import { useState } from "react"
import { Loader2, Plus, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AppHeader from "@/components/shared/AppHeader"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SearchableSelectDropdown } from "@/components/shared/SearchableSelectDropdown"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRemountKey } from "@/hooks/useRemountKey"
import { formatMoney } from "@/utils/format"
import ContributionFormDialog from "./components/ContributionFormDialog"
import ContributionsList from "./components/ContributionsList"
import { useContributions } from "./hooks/useContributions"
import type {
  ContributionDto,
  ContributionStatus,
  ContributionType,
  CreateContributionInput,
} from "./types/contribution"

export default function ContributionsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    items,
    status,
    error,
    balance,
    search,
    setSearch,
    type,
    setType,
    statusFilter,
    setStatusFilter,
    create,
    update,
    close,
  } = useContributions()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ContributionDto | null>(null)
  const [closeTarget, setCloseTarget] = useState<ContributionDto | null>(null)
  const { key: formKey, remount: remountForm } = useRemountKey()

  const has = (key: string) => (user ? user.isAdmin || user.permissions.includes(key) : false)
  const canCreate = has("contributions:create")
  const canWrite = has("contributions:update")
  const canViewReports = has("reports:view")

  const openCreate = () => {
    setEditing(null)
    remountForm()
    setFormOpen(true)
  }

  const openEdit = (contribution: ContributionDto) => {
    setEditing(contribution)
    remountForm()
    setFormOpen(true)
  }

  const viewReport = (contribution: ContributionDto) => {
    navigate(`/contributions/${contribution.id}`)
  }

  const handleSubmit = async (input: CreateContributionInput) => {
    return editing ? update(editing.id, input) : create(input)
  }

  const handleConfirmClose = async () => {
    return closeTarget ? close(closeTarget.id) : false
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Contributions</h1>
          {canCreate ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New contribution
            </Button>
          ) : null}
        </div>

        {canViewReports && balance ? (
          <Card className="mb-4">
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

        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            type="search"
            placeholder="Search contributions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex gap-2">
            <SearchableSelectDropdown
              options={[
                { value: "all", label: "All types" },
                { value: "TARGETED", label: "Targeted" },
                { value: "OPEN", label: "Open" },
              ]}
              value={type}
              onChange={(value) => setType(value as ContributionType | "all")}
              triggerClassName="w-36"
              searchPlaceholder="Search..."
              emptyMessage="No results found."
            />
            <SearchableSelectDropdown
              options={[
                { value: "all", label: "All statuses" },
                { value: "OPEN", label: "Open" },
                { value: "CLOSED", label: "Closed" },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as ContributionStatus | "all")}
              triggerClassName="w-36"
              searchPlaceholder="Search..."
              emptyMessage="No results found."
            />
          </div>
        </div>

        {status === "loading" && items.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <ContributionsList
            contributions={items}
            canWrite={canWrite}
            onEdit={openEdit}
            onViewReport={viewReport}
            onClose={setCloseTarget}
          />
        )}
      </main>

      <ContributionFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        contribution={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={closeTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCloseTarget(null)
          }
        }}
        title="Close contribution?"
        description={`This will close "${closeTarget?.title ?? ""}".`}
        confirmLabel="Close"
        onConfirm={handleConfirmClose}
      />
    </div>
  )
}
