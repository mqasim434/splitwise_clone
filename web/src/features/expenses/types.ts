import type { Member } from "../groups/types";

export type SplitType = "equal" | "exact" | "percentage";

export type Split = {
  user: Member;  
  amount: number;
}

export type Expense = {
  _id: string;
  description: string;
  amount: number;
  paidBy: Member;       
  group: string;
  splitType: SplitType;
  splits: Split[];
  createdAt: string;
  updatedAt: string;
}

type BaseExpenseInput = { 
    description: string; 
    amount: number; 
    groupId: string; 
    paidBy: string 
}

export type ExpenseInput =
  | (BaseExpenseInput & { splitType: "equal"; participants: string[] })
  | (BaseExpenseInput & { splitType: "exact"; splits: { user: string; amount: number }[] })
  | (BaseExpenseInput & { splitType: "percentage"; splits: { user: string; percentage: number }[] })