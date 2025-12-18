import { useGetAllUsers } from "../../api/generated/edutrack";

export default function useAllUsers() {
  const query = useGetAllUsers();

  return {
    ...query,
    users: query.data?.data?.users ?? [],
    totalCount: query.data?.data?.totalCount ?? 0,
  };
}
