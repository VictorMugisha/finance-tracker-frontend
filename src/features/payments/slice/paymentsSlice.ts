import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import { paymentsApi, type ListPaymentsFilters } from "../api/paymentsApi"
import type { CreatePaymentInput, PaymentDto, UpdatePaymentInput } from "../types/payment"

interface PaymentsState {
  items: PaymentDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: PaymentsState = {
  items: [],
  status: "idle",
  error: null,
}

export const fetchPayments = createAsyncThunk<Envelope<PaymentDto[]>, ListPaymentsFilters>(
  "payments/fetchPayments",
  (filters) => paymentsApi.listPayments(filters)
)

export const createPayment = createAsyncThunk<
  Envelope<PaymentDto>,
  CreatePaymentInput,
  { rejectValue: ErrorToastPayload }
>("payments/createPayment", async (input, { rejectWithValue }) => {
  try {
    return await paymentsApi.createPayment(input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const updatePayment = createAsyncThunk<
  Envelope<PaymentDto>,
  { id: string; input: UpdatePaymentInput },
  { rejectValue: ErrorToastPayload }
>("payments/updatePayment", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await paymentsApi.updatePayment(id, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    resetPayments(state) {
      state.items = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.data
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to fetch payments"
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.items = [action.payload.data, ...state.items]
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
      })
  },
})

export const { resetPayments } = paymentsSlice.actions
export default paymentsSlice.reducer
