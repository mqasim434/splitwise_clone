import { SplitType } from "./models.types";

// a user as the clients see it (id as a string, not an ObjectId)
export interface UserSummary {
  _id: string;
  name: string;
  email: string;
}

export interface ExpenseActivity {
  type: "expense";
  _id: string;
  createdAt: Date;
  description: string;
  amount: number;
  splitType: SplitType;
  paidBy: UserSummary;
  splits: { user: UserSummary; amount: number }[];
}

export interface SettlementActivity {
  type: "settlement";
  _id: string;
  createdAt: Date;
  amount: number;
  from: UserSummary;
  to: UserSummary;
}

export type ActivityItem = ExpenseActivity | SettlementActivity;