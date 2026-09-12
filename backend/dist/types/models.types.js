import { Types } from "mongoose";
Interface;
IUser;
{
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}
Interface;
IGroup;
{
    name: string;
    members: Types.ObjectId[];
    createdBy: Types.ObjectId;
    createdAt: Date;
}
//# sourceMappingURL=models.types.js.map