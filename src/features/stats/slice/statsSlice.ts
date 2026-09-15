import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import { statsApi } from "../api/statsApi"
import type { DashboardStats } from "../types/stats"

interface StatsState {
  stats: DashboardStats | null
  status: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: StatsState = {
  stats: null,
  status: "idle",
}

export const fetchStats = createAsyncThunk<Envelope<DashboardStats>, void>("stats/fetchStats", () =>
  statsApi.getStats()
)

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.stats = action.payload.data
      })
      .addCase(fetchStats.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export default statsSlice.reducer
