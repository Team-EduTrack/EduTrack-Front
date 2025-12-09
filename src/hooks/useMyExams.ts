import { useRecoilValue } from "recoil";
import { authState } from "../stores/authStore";
import { useGetMyExams } from "../api/generated/edutrack"; 

export default function useMyExams() {
  const auth = useRecoilValue(authState);
  const studentId = auth.user?.id;

  const query = useGetMyExams(studentId!, {
    query: {
      enabled: !!studentId,
    },
  });

  const exams = query.data?.data ?? []; 

  return {
    ...query,
    exams,
  };
}
