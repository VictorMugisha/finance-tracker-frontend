export type GroupRole = "LEADER" | "ASSISTANT" | "ACCOUNTANT" | "MEMBER"

export interface LinkedUserDto {
  id: string
  name: string
  phone: string
  isAdmin: boolean
  isActive: boolean
  memberId: string | null
  createdAt: string
}

export interface MemberDto {
  id: string
  name: string
  phone: string | null
  role: GroupRole | null
  isActive: boolean
  createdAt: string
  user: LinkedUserDto | null
}
