import { useGetLectureDetailForTeacher } from "../../api/generated/edutrack";

export default function useLectureDetailForTeacher(lectureId: number) {
  const query = useGetLectureDetailForTeacher(lectureId, {
    query: {
      enabled: !!lectureId,
      staleTime: 0,
    },
  });

  return {
    ...query,
    lectureDetail: query.data?.data?.lectureDetailForTeacherResponse ?? null,
    statistics: query.data?.data?.lectureStatisticsResponse ?? null,
  };
}
