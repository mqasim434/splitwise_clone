
export interface SplitResult {
    user: string;
    amount: number;
}

export interface PercentageSplitInput {
  user: string;
  percentage: number;
}

export interface ExactSplitInput {
  user: string;
  amount: number;
}

export interface ExpenseInput {
  paidBy: string;
  splits: { user: string; amount: number }[];
}

export interface SettlementInput {
  from: string;
  to: string;
  amount: number;
}