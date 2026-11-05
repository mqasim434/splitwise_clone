import { model, Schema } from "mongoose";
import { IFriend } from "../types/models.types";

const friendSchema = new Schema<IFriend>({
        requester: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const Friend = model<IFriend>("Friend",friendSchema);