import type { User } from "../auth/types"

export type Member = Pick<User, "_id" | "name" | "email">

export type Group = {
  _id: string
  name: string
  members: Member[]        // CHECK: string[] if the backend doesn't populate members
  createdBy: string        // CHECK: may be a Member object if populated
  createdAt: string
  updatedAt: string
}


export type GroupInput = {
    name: string
}