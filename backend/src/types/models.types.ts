import type { Types } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface IGroup {
    name: string;
    members: Types.ObjectId[];
    createdBy: Types.ObjectId;
    createdAt: Date;
}

export interface ISplit {
    user: Types.ObjectId;
    amount: number;
}

export interface IExpense {
    description: string;
    amount: number;
    paidBy: Types.ObjectId;
    group: Types.ObjectId;
    splitType: "equal" | "unequal" | "percentage";
    splits: ISplit[];
    createdAt: Date;
}

export interface ISettlement {
    group: Types.ObjectId;
    from: Types.ObjectId;
    to: Types.ObjectId;
    amount: number;
    createdAt: Date;
}