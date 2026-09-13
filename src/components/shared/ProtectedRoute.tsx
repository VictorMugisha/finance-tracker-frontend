import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAppSelector } from "@/hooks/redux"

interface ProtectedRouteProps {
  permission?: string
  children: ReactNode
}

export default function ProtectedRoute({ permission, children }: ProtectedRouteProps) {
  const status = useAppSelector((state) => state.auth.status)
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (permission && !user.isAdmin && !user.permissions.includes(permission)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-lg font-semibold">Forbidden</p>
        <p className="text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
