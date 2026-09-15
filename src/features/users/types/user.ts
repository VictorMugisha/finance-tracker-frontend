export interface UserDto {
  id: string
  name: string
  phone: string
  isAdmin: boolean
  isActive: boolean
  memberId: string | null
  memberName: string | null
  role: string | null
  permissions: string[]
  createdAt: string
}

export interface CreateUserInput {
  memberId: string | null
  name: string
  phone: string
  password: string
}

export interface UpdateUserInput {
  memberId?: string | null
  name?: string
  phone?: string
  password?: string
  isActive?: boolean
}
