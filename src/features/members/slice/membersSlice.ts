import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import { membersApi } from "../api/membersApi"
import type { CreateMemberInput, MemberDto, UpdateMemberInput } from "../types/member"

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

export const createMember = createAsyncThunk<
  Envelope<MemberDto>,
  CreateMemberInput,
  { rejectValue: ErrorToastPayload }
>("members/createMember", async (input, { rejectWithValue }) => {
  try {
    return await membersApi.createMember(input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const updateMember = createAsyncThunk<
  Envelope<MemberDto>,
  { id: string; input: UpdateMemberInput },
  { rejectValue: ErrorToastPayload }
>("members/updateMember", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await membersApi.updateMember(id, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const deactivateMember = createAsyncThunk<
  Envelope<MemberDto>,
  string,
  { rejectValue: ErrorToastPayload }
>("members/deactivateMember", async (id, { rejectWithValue }) => {
  try {
    return await membersApi.deactivateMember(id)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

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
      .addCase(createMember.fulfilled, (state, action) => {
        state.members = [action.payload.data, ...state.members]
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.members = state.members.map((member) => (member.id === updated.id ? updated : member))
      })
      .addCase(deactivateMember.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.members = state.members.map((member) => (member.id === updated.id ? updated : member))
      })
  },
})

export default membersSlice.reducer
