import { createBrowserRouter } from "react-router"
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import { Navigate } from "react-router";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <DashboardPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <SignupPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
])