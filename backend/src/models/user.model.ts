import { Schema, model } from "mongoose";
import type { IUser } from "../types/models.types";


const userSchema = new Schema<IUser>({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
   },
   password: {
      type: String,
      required: true,
   }
}, { timestamps: true });

export const User = model<IUser> ("User", userSchema);