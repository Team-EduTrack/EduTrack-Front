import { useCreateExam } from "../../api/generated/edutrack";

export default function useCreateExamMutation() {
  const mutation = useCreateExam();

  return {
    ...mutation,
    createExam: mutation.mutateAsync,
  };
}
