import { useGetLecturesByTeacher } from "../../api/generated/edutrack";

export default function useLecturesByTeacher() {
  const query = useGetLecturesByTeacher({
    query: {
      staleTime: 0,
    },
  });

  return {
    ...query,
    lectures: query.data?.data ?? [],
  };
}
