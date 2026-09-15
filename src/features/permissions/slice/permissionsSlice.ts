import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import { permissionsApi } from "../api/permissionsApi"
import type { PermissionDto } from "../types/permission"

interface PermissionsState {
  items: PermissionDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: PermissionsState = {
  items: [],
  status: "idle",
}

export const fetchPermissions = createAsyncThunk<Envelope<PermissionDto[]>, void>(
  "permissions/fetchPermissions",
  () => permissionsApi.listPermissions()
)

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.data
      })
      .addCase(fetchPermissions.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export default permissionsSlice.reducer
