import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { CreateMemberInput, MemberDto, UpdateMemberInput } from "../types/member"

async function listMembers(search?: string): Promise<Envelope<MemberDto[]>> {
  const res = await api.get<Envelope<MemberDto[]>>("/members", {
    params: search ? { search } : undefined,
  })
  return res.data
}

async function createMember(input: CreateMemberInput): Promise<Envelope<MemberDto>> {
  const res = await api.post<Envelope<MemberDto>>("/members", input)
  return res.data
}

async function updateMember(id: string, input: UpdateMemberInput): Promise<Envelope<MemberDto>> {
  const res = await api.patch<Envelope<MemberDto>>(`/members/${id}`, input)
  return res.data
}

async function deactivateMember(id: string): Promise<Envelope<MemberDto>> {
  const res = await api.delete<Envelope<MemberDto>>(`/members/${id}`)
  return res.data
}

export const membersApi = {
  listMembers,
  createMember,
  updateMember,
  deactivateMember,
}
