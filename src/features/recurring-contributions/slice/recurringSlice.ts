import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import type { ContributionDto } from "@/features/contributions/types/contribution"
import { recurringApi } from "../api/recurringApi"
import type {
  CreateRecurringInput,
  RecurringContributionDto,
  RecurringReportResponse,
  RolloverInput,
  RolloverResult,
  UpdateRecurringInput,
} from "../types/recurring"

interface RecurringState {
  items: RecurringContributionDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  current: RecurringContributionDto | null
  periods: ContributionDto[]
  detailStatus: "idle" | "loading" | "succeeded" | "failed"
  report: RecurringReportResponse | null
  reportStatus: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: RecurringState = {
  items: [],
  status: "idle",
  error: null,
  current: null,
  periods: [],
  detailStatus: "idle",
  report: null,
  reportStatus: "idle",
}

export const fetchRecurringContributions = createAsyncThunk<Envelope<RecurringContributionDto[]>, void>(
  "recurring/fetchRecurringContributions",
  () => recurringApi.list()
)

export const createRecurring = createAsyncThunk<
  Envelope<RecurringContributionDto>,
  CreateRecurringInput,
  { rejectValue: ErrorToastPayload }
>("recurring/createRecurring", async (input, { rejectWithValue }) => {
  try {
    return await recurringApi.create(input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const updateRecurring = createAsyncThunk<
  Envelope<RecurringContributionDto>,
  { id: string; input: UpdateRecurringInput },
  { rejectValue: ErrorToastPayload }
>("recurring/updateRecurring", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await recurringApi.update(id, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const fetchRecurringDetail = createAsyncThunk<
  Envelope<{ recurring: RecurringContributionDto; periods: ContributionDto[] }>,
  string
>("recurring/fetchRecurringDetail", (id) => recurringApi.getDetail(id))

export const fetchRecurringReport = createAsyncThunk<Envelope<RecurringReportResponse>, string>(
  "recurring/fetchRecurringReport",
  (id) => recurringApi.getReport(id)
)

export const rolloverRecurring = createAsyncThunk<
  Envelope<RolloverResult>,
  { id: string; input: RolloverInput },
  { rejectValue: ErrorToastPayload }
>("recurring/rolloverRecurring", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await recurringApi.rollover(id, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const closeRecurring = createAsyncThunk<
  Envelope<RecurringContributionDto>,
  string,
  { rejectValue: ErrorToastPayload }
>("recurring/closeRecurring", async (id, { rejectWithValue }) => {
  try {
    return await recurringApi.close(id)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const reopenRecurring = createAsyncThunk<
  Envelope<RecurringContributionDto>,
  string,
  { rejectValue: ErrorToastPayload }
>("recurring/reopenRecurring", async (id, { rejectWithValue }) => {
  try {
    return await recurringApi.reopen(id)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

const recurringSlice = createSlice({
  name: "recurring",
  initialState,
  reducers: {
    resetDetail(state) {
      state.current = null
      state.periods = []
      state.detailStatus = "idle"
      state.report = null
      state.reportStatus = "idle"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecurringContributions.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchRecurringContributions.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.data
      })
      .addCase(fetchRecurringContributions.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to fetch recurring contributions"
      })
      .addCase(createRecurring.fulfilled, (state, action) => {
        state.items = [action.payload.data, ...state.items]
      })
      .addCase(updateRecurring.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
        if (state.current?.id === updated.id) {
          state.current = { ...updated, periodCount: state.current.periodCount }
        }
      })
      .addCase(fetchRecurringDetail.pending, (state) => {
        state.detailStatus = "loading"
      })
      .addCase(fetchRecurringDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded"
        state.current = action.payload.data.recurring
        state.periods = action.payload.data.periods
      })
      .addCase(fetchRecurringDetail.rejected, (state) => {
        state.detailStatus = "failed"
      })
      .addCase(fetchRecurringReport.pending, (state) => {
        state.reportStatus = "loading"
      })
      .addCase(fetchRecurringReport.fulfilled, (state, action) => {
        state.reportStatus = "succeeded"
        state.report = action.payload.data
      })
      .addCase(fetchRecurringReport.rejected, (state) => {
        state.reportStatus = "failed"
      })
      .addCase(closeRecurring.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
        if (state.current?.id === updated.id) {
          state.current = updated
        }
      })
      .addCase(reopenRecurring.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
        if (state.current?.id === updated.id) {
          state.current = updated
        }
      })
  },
})

export const { resetDetail } = recurringSlice.actions
export default recurringSlice.reducer
