import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../types/express";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (token && token.startsWith("Bearer ")) {
            const actualToken: string = token.split(" ")[1]!;
            const decoded = jwt.verify(actualToken, process.env.JWT_SECRET!);
            req.user = decoded;
            next();
        } else {
            return res.status(401).json({ message: "Authorization Token Not Found" });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};