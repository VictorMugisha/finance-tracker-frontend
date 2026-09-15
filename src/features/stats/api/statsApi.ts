import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { DashboardStats } from "../types/stats"

async function getStats(): Promise<Envelope<DashboardStats>> {
  const res = await api.get<Envelope<DashboardStats>>("/stats")
  return res.data
}

export const statsApi = {
  getStats,
}
