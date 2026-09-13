import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/features/auth/slice/authSlice"
import membersReducer from "@/features/members/slice/membersSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
