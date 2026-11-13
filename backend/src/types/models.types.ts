import type { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGroup {
    _id: Types.ObjectId;
    name: string;
    members: Types.ObjectId[];
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISplit {
    user: Types.ObjectId;
    amount: number;
}

export type SplitType = "equal" | "exact" | "percentage";

export interface IExpense {
    _id: Types.ObjectId;
    description: string;
    amount: number;
    paidBy: Types.ObjectId;
    group: Types.ObjectId;
    splitType: SplitType;
    splits: ISplit[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ISettlement {
    _id: Types.ObjectId;
    group: Types.ObjectId;
    from: Types.ObjectId;
    to: Types.ObjectId;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFriend {
    _id: Types.ObjectId;
    requester: Types.ObjectId;
    recipient: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}