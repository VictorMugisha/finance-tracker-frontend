import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "@/components/shared/ProtectedRoute"
import AuthPage from "@/features/auth/AuthPage"
import MembersPage from "@/features/members/MembersPage"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/members"
          element={
            <ProtectedRoute permission="members:read">
              <MembersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/members" replace />} />
        <Route path="*" element={<Navigate to="/members" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}
