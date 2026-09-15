import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import { usersApi } from "../api/usersApi"
import type { CreateUserInput, UpdateUserInput, UserDto } from "../types/user"

interface UsersState {
  items: UserDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: null,
}

export const fetchUsers = createAsyncThunk<Envelope<UserDto[]>, void>("users/fetchUsers", () =>
  usersApi.listUsers()
)

export const createUser = createAsyncThunk<
  Envelope<UserDto>,
  CreateUserInput,
  { rejectValue: ErrorToastPayload }
>("users/createUser", async (input, { rejectWithValue }) => {
  try {
    return await usersApi.createUser(input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const updateUser = createAsyncThunk<
  Envelope<UserDto>,
  { id: string; input: UpdateUserInput },
  { rejectValue: ErrorToastPayload }
>("users/updateUser", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await usersApi.updateUser(id, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const setUserPermissions = createAsyncThunk<
  Envelope<UserDto>,
  { id: string; permissions: string[] },
  { rejectValue: ErrorToastPayload }
>("users/setUserPermissions", async ({ id, permissions }, { rejectWithValue }) => {
  try {
    return await usersApi.setUserPermissions(id, permissions)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsers(state) {
      state.items = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.data
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to fetch users"
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.items = [action.payload.data, ...state.items]
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
      })
      .addCase(setUserPermissions.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
      })
  },
})

export const { resetUsers } = usersSlice.actions
export default usersSlice.reducer
