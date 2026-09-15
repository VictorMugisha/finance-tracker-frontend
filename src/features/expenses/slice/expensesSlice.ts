import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Envelope } from "@/api/types"
import type { ErrorToastPayload } from "@/api/errors"
import { toErrorToastPayload } from "@/api/errors"
import { expensesApi } from "../api/expensesApi"
import type {
  CreateExpenseInput,
  ExpenseDto,
  ListExpensesFilters,
  UpdateExpenseInput,
} from "../types/expense"

interface ExpensesState {
  items: ExpenseDto[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ExpensesState = {
  items: [],
  status: "idle",
  error: null,
}

export const fetchExpenses = createAsyncThunk<Envelope<ExpenseDto[]>, ListExpensesFilters>(
  "expenses/fetchExpenses",
  (filters) => expensesApi.listExpenses(filters)
)

export const createExpense = createAsyncThunk<
  Envelope<ExpenseDto>,
  CreateExpenseInput,
  { rejectValue: ErrorToastPayload }
>("expenses/createExpense", async (input, { rejectWithValue }) => {
  try {
    return await expensesApi.createExpense(input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

export const updateExpense = createAsyncThunk<
  Envelope<ExpenseDto>,
  { id: string; input: UpdateExpenseInput },
  { rejectValue: ErrorToastPayload }
>("expenses/updateExpense", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await expensesApi.updateExpense(id, input)
  } catch (error) {
    return rejectWithValue(toErrorToastPayload(error))
  }
})

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    resetExpenses(state) {
      state.items = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.data
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Failed to fetch expenses"
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.items = [action.payload.data, ...state.items]
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const updated = action.payload.data
        state.items = state.items.map((item) => (item.id === updated.id ? updated : item))
      })
  },
})

export const { resetExpenses } = expensesSlice.actions
export default expensesSlice.reducer
