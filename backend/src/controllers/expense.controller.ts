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
        // valdate user
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // desctruct req data
        const {
            description,
            amount,
            paidBy,
            groupId,
            splitType,
            participants
        } = req.body;

        let splits: SplitResult[] = [];

        // calculate splits
        switch (splitType) {
            case SplitTypes.EQUAL:
                splits = calculateEqualSplits(amount, participants);
                break;
            case SplitTypes.PERCENTAGE:
                splits = calculatePercentageSplits(amount, participants);
                break;
            case SplitTypes.EXACT:
                splits = calculateExactSplits(amount, participants);
                break;
            default:
                return res.status(400).json({ message: "Unsupported split type" });
        }

        // store calculated expense in db
        const expense = await Expense.create({
            description,
            amount,
            paidBy,
            group: groupId,
            splitType,
            splits
        });

        res.status(201).json({ message: "Expense added successfully", expense });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        res.status(500).json({
            "message": "Unable to add Expense",
            "error": message
        });
    }
}

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