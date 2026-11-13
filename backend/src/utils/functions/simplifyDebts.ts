import { NetBalance, Transfer } from "../../types/settlement.types";

interface creditor {
    user: string;
    cents: number
}

interface debtor {
    user: string;
    cents: number
}

const toCents = (value: number): number => Math.round(value * 100);

export const simplifyDebts = (netBalances: NetBalance[]): Transfer[] => {

    const creditors: creditor[] = [];
    const debtors: debtor[] = [];

    for (const balance of netBalances) {
        const cents = toCents(balance.amount);
        if (cents > 0) {
            creditors.push({
                user: balance.user,
                cents: cents
            });
        } else if (cents < 0) {
            debtors.push({
                user: balance.user,
                cents: -cents
            });
        }
    }

    const totalOwed = creditors.reduce((sum, c) => sum + c.cents, 0);
    const totalDue = debtors.reduce((sum, d) => sum + d.cents, 0);

    if (totalOwed !== totalDue) {
        throw new Error("Balances do not add up to zero");
    }

    // largest first, ties broken by user id so the output is always the same
    const byLargest = (
        a: { user: string; cents: number },
        b: { user: string; cents: number }
    ) => b.cents - a.cents || a.user.localeCompare(b.user);

    const transfers: Transfer[] = [];

    while (creditors.length > 0 && debtors.length > 0) {
        creditors.sort(byLargest);
        debtors.sort(byLargest);

        const creditor = creditors[0];
        const debtor = debtors[0];
        if (!creditor || !debtor) break;

        // the debtor pays as much as possible without overpaying the creditor
        const payment = Math.min(creditor.cents, debtor.cents);

        transfers.push({
            from: debtor.user,
            to: creditor.user,
            amount: payment / 100,
        });

        creditor.cents -= payment;
        debtor.cents -= payment;

        // whoever reached 0 is finished (they are at the front after sorting)
        if (creditor.cents === 0) creditors.shift();
        if (debtor.cents === 0) debtors.shift();
    }

    return transfers;

}