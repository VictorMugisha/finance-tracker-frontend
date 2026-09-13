import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import type { AuthUser } from "@/types/auth-user"
import { tokenStorage } from "@/utils/token"
import { authApi } from "../api/authApi"
import type { CheckPhoneResponse, LoginResponse } from "../types/auth"

interface AuthState {
  user: AuthUser | null
  status: "idle" | "loading" | "authenticated" | "unauthenticated"
}

const initialState: AuthState = {
  user: null,
  status: tokenStorage.get() ? "idle" : "unauthenticated",
}

export const login = createAsyncThunk<
  Envelope<LoginResponse>,
  { phone: string; password: string },
  { rejectValue: ErrorToastPayload }
>("auth/login", async (input, { rejectWithValue }) => {
  try {
    const envelope = await authApi.login(input)
    tokenStorage.set(envelope.data.token)
    return envelope
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const checkPhone = createAsyncThunk<
  Envelope<CheckPhoneResponse>,
  string,
  { rejectValue: ErrorToastPayload }
>("auth/checkPhone", async (phone, { rejectWithValue }) => {
  try {
    return await authApi.checkPhone(phone)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const fetchMe = createAsyncThunk<AuthUser, void>("auth/fetchMe", async () => {
  try {
    const envelope = await authApi.me()
    return envelope.data.user
  } catch (error) {
    tokenStorage.remove()
    throw error
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.status = "unauthenticated"
      tokenStorage.remove()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data.user
        state.status = "authenticated"
      })
      .addCase(login.rejected, (state) => {
        state.status = "unauthenticated"
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = "authenticated"
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null
        state.status = "unauthenticated"
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
