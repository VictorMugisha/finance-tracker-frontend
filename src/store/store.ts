import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/features/auth/slice/authSlice"
import assignmentsReducer from "@/features/assignments/slice/assignmentsSlice"
import contributionsReducer from "@/features/contributions/slice/contributionsSlice"
import expensesReducer from "@/features/expenses/slice/expensesSlice"
import membersReducer from "@/features/members/slice/membersSlice"
import paymentsReducer from "@/features/payments/slice/paymentsSlice"
import permissionsReducer from "@/features/permissions/slice/permissionsSlice"
import statsReducer from "@/features/stats/slice/statsSlice"
import usersReducer from "@/features/users/slice/usersSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    contributions: contributionsReducer,
    assignments: assignmentsReducer,
    payments: paymentsReducer,
    expenses: expensesReducer,
    stats: statsReducer,
    users: usersReducer,
    permissions: permissionsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
