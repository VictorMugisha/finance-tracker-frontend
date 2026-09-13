import type { AuthUser } from "@/types/auth-user"

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface CheckPhoneResponse {
  exists: boolean
  isActive: boolean
  name: string | null
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"
