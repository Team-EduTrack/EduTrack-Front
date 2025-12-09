import { useRecoilValue } from "recoil";
import { authState } from "../stores/authStore";
import { useGetMyAssignments } from "../api/generated/edutrack"; 

export default function useMyAssignments() {
  const auth = useRecoilValue(authState);
  const studentId = auth.user?.id;

  const query = useGetMyAssignments(studentId!, {
    query: {
      enabled: !!studentId,
    },
  });

  const assignments = query.data?.data ?? [];

  return {
    ...query,
    assignments,
  };
}
