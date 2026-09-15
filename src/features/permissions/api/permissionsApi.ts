import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { PermissionDto } from "../types/permission"

async function listPermissions(): Promise<Envelope<PermissionDto[]>> {
  const res = await api.get<Envelope<PermissionDto[]>>("/permissions")
  return res.data
}

export const permissionsApi = {
  listPermissions,
}
