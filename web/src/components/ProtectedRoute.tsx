import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../app/hooks"

const ProtectedRoute = () => {
  const { user, initialized } = useAppSelector((s) => s.auth)

  if (!initialized) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}

export default ProtectedRoute;