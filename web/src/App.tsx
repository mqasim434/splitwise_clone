import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { useAppDispatch } from "./app/hooks";
import { fetchMe } from "./features/auth/authSlice";
import { router } from "./app/router";

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(fetchMe())
  }, [dispatch])

  return <RouterProvider router={router} />
}