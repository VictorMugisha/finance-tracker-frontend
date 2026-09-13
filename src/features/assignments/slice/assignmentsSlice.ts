import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import { assignmentsApi } from "../api/assignmentsApi"
import type {
  AssignmentDto,
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from "../types/assignment"

interface AssignmentsState {
  items: AssignmentDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: AssignmentsState = {
  items: [],
  status: "idle",
  error: null,
}

export const fetchAssignments = createAsyncThunk<Envelope<AssignmentDto[]>, string>(
  "assignments/fetchAssignments",
  (contributionId) => assignmentsApi.listAssignments(contributionId)
)

export const createAssignment = createAsyncThunk<
  Envelope<AssignmentDto>,
  { contributionId: string; input: CreateAssignmentInput },
  { rejectValue: ErrorToastPayload }
>("assignments/createAssignment", async ({ contributionId, input }, { rejectWithValue }) => {
  try {
    return await assignmentsApi.createAssignment(contributionId, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const updateAssignment = createAsyncThunk<
  Envelope<AssignmentDto>,
  { contributionId: string; assignmentId: string; input: UpdateAssignmentInput },
  { rejectValue: ErrorToastPayload }
>(
  "assignments/updateAssignment",
  async ({ contributionId, assignmentId, input }, { rejectWithValue }) => {
    try {
      return await assignmentsApi.updateAssignment(contributionId, assignmentId, input)
    } catch (error) {
      return rejectWithValue(toErrorToastPayload(error))
    }
  }
)

export const removeAssignment = createAsyncThunk<
  Envelope<AssignmentDto>,
  { contributionId: string; assignmentId: string },
  { rejectValue: ErrorToastPayload }
>("assignments/removeAssignment", async ({ contributionId, assignmentId }, { rejectWithValue }) => {
  try {
    return await assignmentsApi.removeAssignment(contributionId, assignmentId)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    resetAssignments(state) {
      state.items = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.data
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to fetch assignments"
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload.data]
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
      })
      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.data.id)
      })
  },
})

export const { resetAssignments } = assignmentsSlice.actions
export default assignmentsSlice.reducer
