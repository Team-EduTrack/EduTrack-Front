import { useAssignStudentsToLecture } from "../../api/generated/edutrack";

export default function useAssignStudentsToLectureMutation() {
  const mutation = useAssignStudentsToLecture();

  return {
    ...mutation,
    assignStudents: mutation.mutateAsync,
  };
}
