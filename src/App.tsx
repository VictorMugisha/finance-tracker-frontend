import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "@/components/shared/ProtectedRoute"
import AuthPage from "@/features/auth/AuthPage"
import ContributionDetailPage from "@/features/contributions/ContributionDetailPage"
import ContributionsPage from "@/features/contributions/ContributionsPage"
import MemberContributionDetailPage from "@/features/contributions/MemberContributionDetailPage"
import DashboardPage from "@/features/dashboard/DashboardPage"
import MembersPage from "@/features/members/MembersPage"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute permission="members:read">
              <MembersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contributions"
          element={
            <ProtectedRoute permission="contributions:read">
              <ContributionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contributions/:id"
          element={
            <ProtectedRoute permission="contributions:read">
              <ContributionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contributions/:contributionId/members/:memberId"
          element={
            <ProtectedRoute permission="contributions:read">
              <MemberContributionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}
