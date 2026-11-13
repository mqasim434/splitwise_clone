import mongoose from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../types/express";
import { Settlement } from "../models/settlement.model";
import { Group } from "../models/group.model";

export const addSettlementController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const currentUserId = req.user.userId;

        const { group: groupId, to, amount } = req.body;

        if (!mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ message: "Invalid group id" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const memberIds = group.members.map((m) => m.toString());

        if (!memberIds.includes(currentUserId)) {
            return res.status(403).json({ message: "Not a member of this group" });
        }
        if (!memberIds.includes(to)) {
            return res.status(400).json({ message: "Recipient must be a group member" });
        }
        if (to === currentUserId) {
            return res.status(400).json({ message: "You cannot pay yourself" });
        }

        const settlement = await Settlement.create({
            group: groupId,
            from: currentUserId,
            to,
            amount,
        });

        return res.status(201).json({
            message: "Settlement added successfully",
            settlement,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        return res.status(500).json({
            message: "Unable to add settlement",
            error: message,
        });
    }
};