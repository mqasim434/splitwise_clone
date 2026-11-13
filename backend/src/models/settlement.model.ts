import { Schema, model } from "mongoose";
import { ISettlement } from "../types/models.types";

const settlementSchema = new Schema<ISettlement>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true, 
      min: 0.01
    },
  },
  { timestamps: true }
);

export const Settlement = model<ISettlement>("Settlement", settlementSchema);