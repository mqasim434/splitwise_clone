// models/Expense.ts
import { Schema, model, HydratedDocument } from "mongoose";
import { IExpense, ISplit } from "../types/models.types";

const splitSchema = new Schema<ISplit>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const expenseSchema = new Schema<IExpense>(
    {
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01
        },
        paidBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true
        },
        splitType: {
            type: String,
            enum: ["equal", "exact", "percentage"],
            required: true,
        },
        splits: {
            type: [splitSchema],
            required: true
        },
    },
    { timestamps: true }
);

export const Expence = model<IExpense> ("Expense", expenseSchema);