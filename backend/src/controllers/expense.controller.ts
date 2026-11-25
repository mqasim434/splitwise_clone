import { AuthRequest } from "../types/express";
import { Response } from "express";
import { SplitTypes } from "../utils/enums/enums";
import { SplitResult } from "../types/expenses.types";
import { calculateEqualSplits, calculateExactSplits, calculatePercentageSplits } from "../utils/functions/splitsCalculator";
import { Expense } from "../models/expense.model";
import mongoose from "mongoose";
import { Group } from "../models/group.model";

export const addExpenseController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUserId = req.user.userId;
        const { description, amount, paidBy, groupId, splitType, participants, splits: inputSplits } = req.body;

        // 1. The group must exist, and the current user must be in it
        if (!mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ message: "Invalid group id" });
        }
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        const memberIds = new Set(group.members.map((m) => m.toString()));
        if (!memberIds.has(currentUserId)) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        // 2. The payer and everyone in the split must be group members
        const involvedIds: string[] =
            splitType === SplitTypes.EQUAL
                ? participants ?? []
                : (inputSplits ?? []).map((s: { user: string }) => s.user);

        if (involvedIds.length === 0) {
            return res.status(400).json({ message: "Add at least one person to the split" });
        }
        if (!memberIds.has(paidBy) || involvedIds.some((id) => !memberIds.has(id))) {
            return res.status(400).json({ message: "Payer and participants must be members of the group" });
        }

        // 3. Calculate the splits. Calculator errors are bad input, so they become a 400.
        let splits: SplitResult[] = [];
        try {
            switch (splitType) {
                case SplitTypes.EQUAL:
                    splits = calculateEqualSplits(amount, participants);
                    break;
                case SplitTypes.EXACT:
                    splits = calculateExactSplits(amount, inputSplits);
                    break;
                case SplitTypes.PERCENTAGE:
                    splits = calculatePercentageSplits(amount, inputSplits);
                    break;
                default:
                    return res.status(400).json({ message: "Unsupported split type" });
            }
        } catch (calcError) {
            const message = calcError instanceof Error ? calcError.message : "Invalid split";
            return res.status(400).json({ message });
        }

        // 4. Save, then populate so the client gets names
        const expense = await Expense.create({
            description,
            amount,
            paidBy,
            group: groupId,
            splitType,
            splits,
        });
        await expense.populate([
            { path: "paidBy", select: "name email" },
            { path: "splits.user", select: "name email" },
        ]);

        res.status(201).json({ message: "Expense added successfully", expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to add expense" });
    }
};

export const getGroupExpensesController = async (req: AuthRequest, res: Response) => {
    try {
        // valdate user
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUserId = req.user.userId;
        const { id: groupId } = req.params;

        if (!mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ message: "Invalid group id" });
        }

        const group = await Group.findById(groupId);

        if (typeof groupId !== "string" || !mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ message: "Invalid group id" });
        }


        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isMember = group.members.some((m) => m.toString() === currentUserId);

        if (!isMember) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        const expenses = await Expense.find({ group: groupId })
            .sort({ createdAt: -1 })
            .populate("paidBy", "name email")
            .populate("splits.user", "name email");

        res.status(200).json({ message: "Expenses retrieved successfully", expenses });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        res.status(500).json({
            "message": "Unable to retrieve expenses",
            "error": message
        });
    }
}