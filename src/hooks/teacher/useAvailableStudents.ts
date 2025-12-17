import { useGetAvailableStudentsForLecture } from "../../api/generated/edutrack";

export default function useAvailableStudentsForLecture(
  lectureId: number,
  name: string
) {
  const query = useGetAvailableStudentsForLecture(
    lectureId,
    { name },
    {
      query: {
        enabled: !!lectureId && !!name,
        staleTime: 0,
      },
    }
  );

  return {
    ...query,
    availableStudents: query.data?.data ?? [],
  };
}
