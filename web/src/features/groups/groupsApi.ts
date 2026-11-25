import type { Group, GroupInput } from "./types";
import { api } from "../../api/client";
import type { Expense } from "../expenses/types";

export const createGroupRequest = (data: GroupInput) =>
  api.post<{ group: Group }>("/groups", data).then((r) => r.data.group)

export const fetchGroupsRequest = () =>
  api.get<{ groups: Group[] }>("/groups").then((r) => r.data.groups);

export const fetchGroupByIdRequest = (groupId: string) =>
  api.get<{ group: Group }>(`/groups/${groupId}`).then((r) => r.data.group);

export const fetchGroupExpensesRequest = (groupId: string) =>
  api.get<{ expenses: Expense[] }>(`/groups/${groupId}/expenses`).then((r) => r.data.expenses);