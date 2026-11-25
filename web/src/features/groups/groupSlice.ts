import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Group, GroupInput } from "./types";
import { createGroupRequest, fetchGroupsRequest, fetchGroupByIdRequest, fetchGroupExpensesRequest } from "./groupsApi";
import axios from "axios";
import type { Expense, ExpenseInput } from "../expenses/types";
import { createExpenseRequest } from "../expenses/expenseApi";

type GroupsState = {
    groups: Group[]
    status: 'idle' | 'loading' | 'error',
    error: string | null
    createStatus: "idle" | "loading" | "failed",
    currentGroup: Group | null,
    currentExpenses: Expense[],
    detailStatus: "idle" | "loading" | "failed"
    expenseStatus: "idle" | "loading" | "failed"
}

const initialState: GroupsState = {
    groups: [],
    status: 'idle',
    error: null,
    createStatus: "idle",
    currentGroup: null,
    currentExpenses: [],
    detailStatus: "idle",
    expenseStatus: "idle"
}

const errorMessage = (err: unknown) =>
    axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Something went wrong"
        : "Something went wrong"

export const createGroup = createAsyncThunk("groups/create", async (data: GroupInput, { rejectWithValue }) => {
    try {
        return await createGroupRequest(data);
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

export const fetchGroups = createAsyncThunk("groups/fetch", async (_, { rejectWithValue }) => {
    try {
        return await fetchGroupsRequest();
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

export const fetchGroupDetails = createAsyncThunk(`group/details`, async (id: string, { rejectWithValue }) => {
    try {
        const [group, expenses] = await Promise.all([
            fetchGroupByIdRequest(id),
            fetchGroupExpensesRequest(id),
        ]);
        return { group, expenses };
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

export const createExpense = createAsyncThunk(`groups/createExpense`, async (data: ExpenseInput, { rejectWithValue }) => {
    try {
        return await createExpenseRequest(data);
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

export const groupsSlice = createSlice({
    name: 'Groups',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(createGroup.pending, (state) => {
            state.createStatus = "loading";
            state.error = null;
        })
        builder.addCase(createGroup.fulfilled, (state, action) => {
            state.createStatus = "idle";
            state.groups.unshift(action.payload);
        })
        builder.addCase(createGroup.rejected, (state, action) => {
            state.createStatus = "failed";
            state.error = (action.payload as string) ?? "Failed to create group";
        })

        builder.addCase(fetchGroups.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        builder.addCase(fetchGroups.fulfilled, (state, action) => {
            state.status = "idle";
            state.groups = action.payload;
        })
        builder.addCase(fetchGroups.rejected, (state, action) => {
            state.status = "error";
            state.error = (action.payload as string) ?? "Failed to load groups";
        });

        builder.addCase(fetchGroupDetails.pending, (state) => {
            state.detailStatus = "loading";
            state.error = null;
            state.currentGroup = null;
            state.currentExpenses = [];
        });
        builder.addCase(fetchGroupDetails.fulfilled, (state, action) => {
            state.detailStatus = "idle";
            state.error = null;
            state.currentGroup = action.payload.group;
            state.currentExpenses = action.payload.expenses; 
        });
        builder.addCase(fetchGroupDetails.rejected, (state, action) => {
            state.detailStatus = "failed";
            state.error = (action.payload as string) ?? "Failed to fetch group details";
        });

        builder.addCase(createExpense.pending, (state)=>{
            state.expenseStatus = "loading";
            state.error = null;
        });
        builder.addCase(createExpense.fulfilled, (state,action)=>{
            state.expenseStatus = "idle";
            state.error = null;
            state.currentExpenses.unshift(action.payload);
        });
        builder.addCase(createExpense.rejected, (state,action)=>{
            state.expenseStatus = "failed";
            state.error = (action.payload as string) ?? "Failed to create expense";
        });

    }
});


export default groupsSlice.reducer;