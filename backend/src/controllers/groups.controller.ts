import { Response } from "express"
import { Group } from "../models/group.model";
import { AuthRequest } from "../types/express";
import { IGroup } from "../types/models.types";

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


export const getGroupController = async (req:AuthRequest, res: Response)=>{
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUserId = req.user.userId;
        const {id: groupId} = req.params;

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