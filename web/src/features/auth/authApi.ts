import { api } from "../../api/client";
import type { AuthResponse, LoginInput, RegisterInput, User } from "./types";

export const loginRequest = (data: LoginInput) =>
  api.post<AuthResponse>("/auth/login", data).then((r) => r.data);

export const registerRequest = (data: RegisterInput) =>
  api.post<AuthResponse>("/auth/register", data).then((r) => r.data);

export const meRequest = () =>
  api.get<{ user: User }>("/auth/me").then((r) => r.data.user);