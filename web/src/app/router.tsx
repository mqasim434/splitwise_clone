import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import GroupsPage from "../features/groups/pages/GroupsPage";
import GroupDetailPage from "../features/groups/pages/GroupDetailPage";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/groups", element: <GroupsPage /> },
          { path: "/groups/:id", element: <GroupDetailPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <SignupPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
])