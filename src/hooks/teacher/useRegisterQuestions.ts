import { useRegisterExamQuestions } from "../../api/generated/edutrack";

export default function useRegisterExamQuestionsMutation() {
  const mutation = useRegisterExamQuestions();

  return {
    ...mutation,
    registerQuestions: mutation.mutateAsync,
  };
}
