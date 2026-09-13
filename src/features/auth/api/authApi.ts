import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { AuthUser } from "@/types/auth-user"
import type { CheckPhoneResponse, LoginResponse } from "../types/auth"

async function checkPhone(phone: string): Promise<Envelope<CheckPhoneResponse>> {
  const res = await api.post<Envelope<CheckPhoneResponse>>("/auth/check-phone", { phone })
  return res.data
}

async function login(input: { phone: string; password: string }): Promise<Envelope<LoginResponse>> {
  const res = await api.post<Envelope<LoginResponse>>("/auth/login", input)
  return res.data
}

async function me(): Promise<Envelope<{ user: AuthUser }>> {
  const res = await api.get<Envelope<{ user: AuthUser }>>("/auth/me")
  return res.data
}

export const authApi = {
  checkPhone,
  login,
  me,
}
