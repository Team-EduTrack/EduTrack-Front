import type {
    PageUserSearchResultResponse,
    SearchAllUserResponse,
    UserSearchResultResponse,
  } from "../../api/generated/edutrack";
  
  export type NormalizedUsers = {
    users: UserSearchResultResponse[];
    totalCount: number;
    totalPages: number;
  };
  
  export function normalizeUserSearchResponse(
    raw: unknown,
    page: number, 
    size: number
  ): NormalizedUsers {
    if (raw && typeof raw === "object" && "content" in (raw as any)) {
      const r = raw as PageUserSearchResultResponse;
      const users = r.content ?? [];
      const totalCount = r.totalElements ?? users.length;
      const totalPages =
        r.totalPages ?? Math.max(1, Math.ceil(totalCount / size));
      return { users, totalCount, totalPages };
    }
  
    if (raw && typeof raw === "object" && "users" in (raw as any)) {
      const r = raw as SearchAllUserResponse;
      const all = r.users ?? [];
      const totalCount = r.totalCount ?? all.length;
  
      const start = (page - 1) * size;
      const users = all.slice(start, start + size);
  
      const totalPages = Math.max(1, Math.ceil(totalCount / size));
      return { users, totalCount, totalPages };
    }
  
    if (Array.isArray(raw)) {
      const all = raw as UserSearchResultResponse[];
      const totalCount = all.length;
      const start = (page - 1) * size;
      const users = all.slice(start, start + size);
      const totalPages = Math.max(1, Math.ceil(totalCount / size));
      return { users, totalCount, totalPages };
    }
  
    return { users: [], totalCount: 0, totalPages: 1 };
  }
  