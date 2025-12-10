import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import { useGetMyExams } from "../../api/generated/edutrack";

export default function useLectureExams(lectureTitle?: string) {
  const auth = useRecoilValue(authState);
  const studentId = auth.user?.id;

  
  const query = useGetMyExams(studentId!, {
    query: {
      enabled: !!studentId,
    },
  });

  const allExams = query.data?.data ?? [];

  // lectureTitle 로 필터링 (임시)
  const examsForLecture = allExams.filter(
    (exam) => exam.lectureTitle?.trim() === lectureTitle?.trim()
  );

  return {
    ...query,
    exams: examsForLecture, 
  };
}
