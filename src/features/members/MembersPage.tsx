import { Loader2 } from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import { Input } from "@/components/ui/input"
import MemberList from "./components/MemberList"
import { useMembers } from "./hooks/useMembers"

export default function MembersPage() {
  const { members, status, error, search, setSearch } = useMembers()

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 p-4">
        <h1 className="mb-4 text-xl font-semibold">Members</h1>
        <Input
          type="search"
          placeholder="Search members..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mb-4"
        />
        {status === "loading" && members.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <MemberList members={members} />
        )}
      </main>
    </div>
  )
}
