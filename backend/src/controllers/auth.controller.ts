import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error"
        res.status(500).json({
            "message": "Failed to register",
            "error": message
        });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {

                const token: string = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET!,
                    { expiresIn: "1d" }
                );

                return res.status(200).json({
                    message: "Logged In Successfully",
                    token,
                    user: {
                        "id": user._id,
                        "name": user.name,
                        "email": user.email,
                        "createdAt": user.createdAt,
                        "updatedAt": user.updatedAt,
                    }
                });
            } else {
                return res.status(400).json({ message: "Invalid Credentials" });
            }
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error"
        res.status(500).json({
            "message": "Failed to Login",
            "error": message
        });
    }
}

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        } else {
            const userId = req.user.userId;

            const user = await User.findById(userId).select("-password");

            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(404).json({ message: "Invalid User" });
            }

        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Error"
        res.status(500).json({
            "message": "Failed to fetch user",
            "error": message
        });
    }
}