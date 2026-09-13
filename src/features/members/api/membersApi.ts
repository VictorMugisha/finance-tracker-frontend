import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { MemberDto } from "../types/member"

async function listMembers(search?: string): Promise<Envelope<MemberDto[]>> {
  const res = await api.get<Envelope<MemberDto[]>>("/members", {
    params: search ? { search } : undefined,
  })
  return res.data
}

export const membersApi = {
  listMembers,
}
