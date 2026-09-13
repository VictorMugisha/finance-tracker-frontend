import { Navigate } from "react-router-dom"
import { Loader2, Wallet } from "lucide-react"
import { useAppSelector } from "@/hooks/redux"
import LoginForm from "./components/LoginForm"

export default function AuthPage() {
  const status = useAppSelector((state) => state.auth.status)

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === "authenticated") {
    return <Navigate to="/members" replace />
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Wallet className="size-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Finance Tracker</h1>
          <p className="text-sm text-muted-foreground">Group contributions, made simple.</p>
        </div>
      </div>
      <LoginForm />
    </main>
  )
}
