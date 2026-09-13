import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import { membersApi } from "../api/membersApi"
import type { MemberDto } from "../types/member"

interface MembersState {
  members: MemberDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: MembersState = {
  members: [],
  status: "idle",
  error: null,
}

export const fetchMembers = createAsyncThunk<Envelope<MemberDto[]>, string | undefined>(
  "members/fetchMembers",
  (search) => membersApi.listMembers(search)
)

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.members = action.payload.data
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to fetch members"
      })
  },
})

export default membersSlice.reducer
