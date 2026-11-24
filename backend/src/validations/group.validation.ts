import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(50),
});

export const addMembersSchema = z.object({
  emails: z.array(z.email()).min(1).max(20),
})