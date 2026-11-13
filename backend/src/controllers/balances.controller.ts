import { Group } from "../models/group.model";
import { Expense } from "../models/expense.model";
import { User } from "../models/user.model";
import { Settlement } from "../models/settlement.model";
import { AuthRequest } from "../types/express";
import { Response } from "express";
import mongoose from "mongoose";
import { calculateNetBalances } from "../utils/functions/calculateNetBalances";
import { simplifyDebts } from "../utils/functions/simplifyDebts";

export const getGroupBalancesController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUserId = req.user.userId;
        const { id: groupId } = req.params;

        if (typeof groupId !== "string" || !mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ message: "Invalid group id" });
        }

        // load group and check membership
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isMember = group?.members.some((member) => member.toString() === currentUserId);

        if (!isMember) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        // load everything in parallel (no populate, the calculator needs plain ids)
        const [expenses, settlements, members] = await Promise.all([
            Expense.find({ group: groupId }),
            Settlement.find({ group: groupId }),
            User.find({ _id: { $in: group.members } }).select("name email"),
        ]);

        const expenseInputs = expenses.map((e) => ({
            paidBy: e.paidBy.toString(),
            splits: e.splits.map((s) => ({ user: s.user.toString(), amount: s.amount })),
        }));

        const settlementInputs = settlements.map((s) => ({
            from: s.from.toString(),
            to: s.to.toString(),
            amount: s.amount,
        }));

        // the actual work
        const nets = calculateNetBalances(expenseInputs, settlementInputs);
        const transfers = simplifyDebts(nets);


        const people = new Map(
            members.map(
                (m) =>
                    [m._id.toString(), { _id: m._id.toString(), name: m.name, email: m.email }] as const
            )
        );

        const person = (id: string) => people.get(id) ?? { _id: id, name: "Unknown", email: "" };

        const netMap = new Map(nets.map((n) => [n.user, n.amount] as const));

        const balances = members.map((m) => ({
            user: person(m._id.toString()),
            amount: netMap.get(m._id.toString()) ?? 0,
        }));

        const simplified = transfers.map((t) => ({
            from: person(t.from),
            to: person(t.to),
            amount: t.amount,
        }));

        return res.status(200).json({
            message: "Balances retrieved successfully",
            balances,
            simplified,
        });




    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        res.status(500).json({
            "message": "Unable to fetch balances",
            "error": message
        });
    }
}