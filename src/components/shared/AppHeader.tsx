import { LogOut } from "lucide-react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { useAuth } from "@/features/auth/hooks/useAuth"
import ThemeToggle from "./ThemeToggle"

const NAV_LINKS = [
  { to: "/members", label: "Members" },
  { to: "/contributions", label: "Contributions" },
]

export default function AppHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b bg-background px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Finance Tracker</span>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
          ) : null}
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
