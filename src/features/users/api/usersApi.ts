import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type { CreateUserInput, UpdateUserInput, UserDto } from "../types/user"

async function listUsers(): Promise<Envelope<UserDto[]>> {
  const res = await api.get<Envelope<UserDto[]>>("/users")
  return res.data
}

async function getUser(id: string): Promise<Envelope<UserDto>> {
  const res = await api.get<Envelope<UserDto>>(`/users/${id}`)
  return res.data
}

async function createUser(input: CreateUserInput): Promise<Envelope<UserDto>> {
  const res = await api.post<Envelope<UserDto>>("/users", input)
  return res.data
}

async function updateUser(id: string, input: UpdateUserInput): Promise<Envelope<UserDto>> {
  const res = await api.patch<Envelope<UserDto>>(`/users/${id}`, input)
  return res.data
}

async function setUserPermissions(id: string, permissions: string[]): Promise<Envelope<UserDto>> {
  const res = await api.put<Envelope<UserDto>>(`/users/${id}/permissions`, { permissions })
  return res.data
}

export const usersApi = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  setUserPermissions,
}
