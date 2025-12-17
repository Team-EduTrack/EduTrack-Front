import { useCreateLecture } from "../../api/generated/edutrack";

export default function useCreateLectureMutation() {
  const mutation = useCreateLecture();

  return {
    ...mutation,
    createLecture: mutation.mutateAsync,
  };
}
