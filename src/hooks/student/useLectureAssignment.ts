import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import { useGetAssignmentsForLecture } from "../../api/generated/edutrack";

export default function useLectureAssignments(lectureId: number) {
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id;

  const query = useGetAssignmentsForLecture(academyId!, lectureId, {
    query: {
      enabled: !!academyId && !!lectureId, 
    },
  });

  const assignments = query.data?.data ?? [];

  console.log("academyId:", academyId, "lectureId:", lectureId);

  return {
    ...query,        
    assignments,     
  };
}
