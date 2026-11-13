import { Response } from "express"
import { Group } from "../models/group.model";
import { AuthRequest } from "../types/express";
import { User } from "../models/user.model";
import { Expense } from "../models/expense.model";
import { Settlement } from "../models/settlement.model";
import { ActivityItem } from "../types/activity.types";
import { UserSummary } from "../types/activity.types";
import mongoose from "mongoose";

export const createGroupController = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.userId;

        const group = await new Group({ name, members: [userId], createdBy: userId }).save();

        res.status(201).json({
            message: "Group created successfully",
            group
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        res.status(500).json({
            "message": "Unable to create group",
            "error": message
        });
    }
}

export const addMembersToGroupController = async (req: AuthRequest, res: Response) => {
    try {
        const { members } = req.body;
        const { id: groupId } = req.params;

        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const group = await Group.findById(groupId);

        if (group) {

            if (group.createdBy.toString() !== req.user.userId) {
                return res.status(403).json({ message: "Only the group creator can add members" });
            }

            const existingMemberIds = group.members.map((m) => m.toString());
            const newUserIds = members.filter((id: string) => !existingMemberIds.includes(id));
            group.members = [...group.members, ...newUserIds];
            await group.save();
            res.status(200).json({ "message": "Members added to group succesfully", group });

        } else {
            res.status(404).json({ "message": "Group Not found" });
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        res.status(500).json({
            "message": "Unable to add member(s)",
            "error": message
        });
    }
}

export const getUserGroupsController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const groups = await Group.find({ "members": req.user.userId });

        res.status(200).json({
            "message": "User groups retrieved successfully",
            groups
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unkown Error";
        res.status(500).json({
            "message": "Unable to retrieve user groups",
            "error": message
        });
    }
}


export const getGroupController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUserId = req.user.userId;
        const { id: groupId } = req.params;

        const group = await Group.findById(groupId)
            .populate("members", "name email")
            .populate("createdBy", "name email");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isMember = group.members.some(
            (memberId) => memberId._id.toString() === currentUserId
        );

        if (!isMember) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        res.status(200).json({ message: "Group retrieved successfully", group });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unkown Error";
        res.status(500).json({
            "message": "Unable to retrieve group",
            "error": message
        });
    }
}


export const getGroupActivityController = async (req: AuthRequest, res: Response) => {
    try {
        // validate user
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
        const isMember = group.members.some((m) => m.toString() === currentUserId);
        if (!isMember) {
            return res.status(403).json({ message: "Not a member of this group" });
        }

        // load everything in parallel, no populate
        const [expenses, settlements, members] = await Promise.all([
            Expense.find({ group: groupId }),
            Settlement.find({ group: groupId }),
            User.find({ _id: { $in: group.members } }).select("name email"),
        ]);
        // id -> user lookup for names
        const people = new Map(
            members.map(
                (m) =>
                    [m._id.toString(), { _id: m._id.toString(), name: m.name, email: m.email }] as const
            )
        );
        const person = (id: string): UserSummary =>
            people.get(id) ?? { _id: id, name: "Unknown", email: "" };

        // build one list
        const activity: ActivityItem[] = [];

        for (const expense of expenses) {
            activity.push({
                type: "expense",
                _id: expense._id.toString(),
                createdAt: expense.createdAt,
                description: expense.description,
                amount: expense.amount,
                splitType: expense.splitType,
                paidBy: person(expense.paidBy.toString()),
                splits: expense.splits.map((s) => ({
                    user: person(s.user.toString()),
                    amount: s.amount,
                })),
            });
        }

        for (const settlement of settlements) {
            activity.push({
                type: "settlement",
                _id: settlement._id.toString(),
                createdAt: settlement.createdAt,
                amount: settlement.amount,
                from: person(settlement.from.toString()),
                to: person(settlement.to.toString()),
            });
        }

        // newest first
        activity.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return res.status(200).json({ message: "Activity retrieved successfully", activity });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unkown Error";
        res.status(500).json({
            "message": "Unable to retrieve group activity",
            "error": message
        });
    }
}