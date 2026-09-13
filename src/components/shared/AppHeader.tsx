import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function AppHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 flex items-center justify-between border-b bg-background px-4 py-3">
      <span className="font-semibold">Finance Tracker</span>
      <div className="flex items-center gap-3">
        {user ? <span className="text-sm text-muted-foreground">{user.name}</span> : null}
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
