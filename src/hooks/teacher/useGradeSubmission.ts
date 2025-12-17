import { useGradeSubmission } from "../../api/generated/edutrack";

export default function useGradeSubmissionMutation() {
  const mutation = useGradeSubmission();

  return {
    ...mutation,
    gradeSubmission: mutation.mutateAsync,
  };
}
