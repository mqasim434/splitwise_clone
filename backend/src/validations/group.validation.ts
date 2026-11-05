import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(50),
});

export const addMembersSchema = z.object({
  email: z.string().email(),
});