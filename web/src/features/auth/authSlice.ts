import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { loginRequest, meRequest, registerRequest } from "./authApi"
import type { LoginInput, RegisterInput, User } from "./types"

type AuthState = {
  user: User | null
  token: string | null
  status: "idle" | "loading" | "failed"
  error: string | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  status: "idle",
  error: null,
  initialized: !localStorage.getItem("token"),
}

const errorMessage = (err: unknown) =>
  axios.isAxiosError(err)
    ? err.response?.data?.message ?? "Something went wrong" 
    : "Something went wrong"

export const login = createAsyncThunk("auth/login", async (data: LoginInput, { rejectWithValue }) => {
  try { 
    return await loginRequest(data);
  } catch (e) { 
    return rejectWithValue(errorMessage(e));
  }
});

export const register = createAsyncThunk("auth/register", async (data: RegisterInput, { rejectWithValue }) => {
  try { 
    return await registerRequest(data); 
  } catch (e) { 
    return rejectWithValue(errorMessage(e));
  }
})

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try { return await meRequest() } catch (e) { return rejectWithValue(errorMessage(e)) }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token")
    },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    for (const thunk of [login, register]) {
      builder
        .addCase(thunk.pending, (s) => { 
          s.status = "loading"; s.error = null 
        })
        .addCase(thunk.fulfilled, (s, a) => {
          s.status = "idle"
          s.user = a.payload.user
          s.token = a.payload.token
          localStorage.setItem("token", a.payload.token)
        })
        .addCase(thunk.rejected, (s, a) => { 
          s.status = "failed"; 
          s.error = (a.payload as string) ?? "Failed";
        });
    }
    builder
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.initialized = true })
      .addCase(fetchMe.rejected, (s) => {
        s.user = null; 
        s.token = null; 
        s.initialized = true
        localStorage.removeItem("token")   // saved token was invalid or expired
      });
  }
});


export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;