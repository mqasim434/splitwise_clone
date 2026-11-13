import { NetBalance } from "../../types/settlement.types";
import { ExpenseInput, SettlementInput } from "../../types/expenses.types";

const toCents = (value: number): number => Math.round(value * 100);

export const calculateNetBalances = (
    expenses: ExpenseInput[],
    settlements: SettlementInput[]): NetBalance[] => {

    const cents = new Map<string, number>();

    const add = (user: string, delta: number) => {
        cents.set(user, (cents.get(user) ?? 0) + delta);
    }

    for (const expense of expenses) {
        for (const split of expense.splits) {
            const share = toCents(split.amount);
            add(split.user, -share);      
            add(expense.paidBy, share);   
        }
    }

    for (const settlement of settlements) {
        const value = toCents(settlement.amount);
        add(settlement.from, +value);
        add(settlement.to, -value);
    }

    const total = [...cents.values()].reduce((total,value)=>total+value,0);

    if(total !== 0){
        throw new Error("Balances do not add up to zero");
    }

    return [...cents.entries()].map(([user, c]) => ({user,amount:c/100}));
}


