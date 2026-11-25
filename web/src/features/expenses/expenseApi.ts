import { api } from "../../api/client"
import type { Expense, ExpenseInput } from "./types"

export const createExpenseRequest = (data: ExpenseInput) =>
  api.post<{ expense: Expense }>("/expense", data).then((r) => r.data.expense);