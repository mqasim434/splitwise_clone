import {model, Schema} from "mongoose";
import { IGroup } from "../types/models.types";

const groupSchema = new Schema<IGroup>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
{
    timestamps: true
});

export const Group = model<IGroup>("Group",groupSchema);