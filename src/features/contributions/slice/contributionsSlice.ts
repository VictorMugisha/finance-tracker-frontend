import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import { contributionsApi } from "../api/contributionsApi"
import type {
  ContributionDto,
  ContributionReportResponse,
  CreateContributionInput,
  GroupBalanceResponse,
  ListContributionsFilters,
  UpdateContributionInput,
} from "../types/contribution"

interface ContributionsState {
  items: ContributionDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  balance: GroupBalanceResponse | null
  current: ContributionDto | null
  report: ContributionReportResponse | null
  detailStatus: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: ContributionsState = {
  items: [],
  status: "idle",
  error: null,
  balance: null,
  current: null,
  report: null,
  detailStatus: "idle",
}

export const fetchContributions = createAsyncThunk<
  Envelope<ContributionDto[]>,
  ListContributionsFilters | undefined
>("contributions/fetchContributions", (filters) => contributionsApi.listContributions(filters))

export const fetchBalance = createAsyncThunk<Envelope<GroupBalanceResponse>, void>(
  "contributions/fetchBalance",
  () => contributionsApi.getBalance()
)

export const fetchContributionDetail = createAsyncThunk<Envelope<ContributionDto>, string>(
  "contributions/fetchContributionDetail",
  (id) => contributionsApi.getContribution(id)
)

export const fetchReport = createAsyncThunk<Envelope<ContributionReportResponse>, string>(
  "contributions/fetchReport",
  (id) => contributionsApi.getReport(id)
)

export const createContribution = createAsyncThunk<
  Envelope<ContributionDto>,
  CreateContributionInput,
  { rejectValue: ErrorToastPayload }
>("contributions/createContribution", async (input, { rejectWithValue }) => {
  try {
    return await contributionsApi.createContribution(input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const updateContribution = createAsyncThunk<
  Envelope<ContributionDto>,
  { id: string; input: UpdateContributionInput },
  { rejectValue: ErrorToastPayload }
>("contributions/updateContribution", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await contributionsApi.updateContribution(id, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const closeContribution = createAsyncThunk<
  Envelope<ContributionDto>,
  string,
  { rejectValue: ErrorToastPayload }
>("contributions/closeContribution", async (id, { rejectWithValue }) => {
  try {
    return await contributionsApi.closeContribution(id)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

const contributionsSlice = createSlice({
  name: "contributions",
  initialState,
  reducers: {
    resetDetail(state) {
      state.current = null
      state.report = null
      state.detailStatus = "idle"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContributions.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchContributions.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.data
      })
      .addCase(fetchContributions.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to fetch contributions"
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload.data
      })
      .addCase(createContribution.fulfilled, (state, action) => {
        state.items = [action.payload.data, ...state.items]
      })
      .addCase(updateContribution.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
        state.current = updated
      })
      .addCase(closeContribution.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
        state.current = updated
      })
      .addCase(fetchContributionDetail.pending, (state) => {
        state.detailStatus = "loading"
      })
      .addCase(fetchContributionDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded"
        state.current = action.payload.data
      })
      .addCase(fetchContributionDetail.rejected, (state) => {
        state.detailStatus = "failed"
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.report = action.payload.data
      })
  },
})

export const { resetDetail } = contributionsSlice.actions
export default contributionsSlice.reducer
