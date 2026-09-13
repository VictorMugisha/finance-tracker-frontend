import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/features/auth/slice/authSlice"
import assignmentsReducer from "@/features/assignments/slice/assignmentsSlice"
import contributionsReducer from "@/features/contributions/slice/contributionsSlice"
import membersReducer from "@/features/members/slice/membersSlice"
import paymentsReducer from "@/features/payments/slice/paymentsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    contributions: contributionsReducer,
    assignments: assignmentsReducer,
    payments: paymentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
