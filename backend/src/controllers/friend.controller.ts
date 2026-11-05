import { AuthRequest } from "../types/express";
import { Response } from "express";
import { User } from "../models/user.model";
import { Friend } from "../models/friend.model";
import { Group } from "../models/group.model";


export const addFriendController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUserId = req.user.userId;
        const { email } = req.body;

        const friend = await User.findOne({ email });

        if (!friend) return res.status(404).json({ message: "User not found" });

        if (friend._id.toString() === currentUserId) {
            return res.status(400).json({ message: "You cannot add yourself" });
        }

        const existing = await Friend.findOne({
            $or: [
                { requester: currentUserId, recipient: friend._id },
                { requester: friend._id, recipient: currentUserId },
            ],
        });

        if (existing) return res.status(409).json({ message: "Already friends" });

        await Friend.create({ requester: currentUserId, recipient: friend._id });
        
        res.status(201).json({ message: "Friend added" });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        res.status(500).json({
            "message": "Unable to add friend",
            "error": message
        });
    }
}


export const getFriendsController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const currentUserId = req.user.userId;
        const friendsIds = new Set<string>();

        const groups = await Group.find({"members": currentUserId });

        groups.forEach((group)=>{
            group.members.forEach((member)=>{
                if(member.toString() !== currentUserId){
                    friendsIds.add(member.toString());
                }
            });
        });


        const directFriends = await Friend.find({
            $or: [
                {recipient: currentUserId},
                {requester: currentUserId}
            ]
        });

        directFriends.forEach((friend)=>{
            const other = friend.requester.toString() === currentUserId ? friend.recipient : friend.requester;
            friendsIds.add(other.toString());
        });

        const friends = await User.find({
            _id: {
                $in: [...friendsIds]
            }
        }).select("name email");

        res.status(200).json({friends});

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error";
        res.status(500).json({
            "message": "Unable to retrieve friends",
            "error": message
        });
    }
}