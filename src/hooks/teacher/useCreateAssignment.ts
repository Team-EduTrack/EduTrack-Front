import { useCreateAssignment } from "../../api/generated/edutrack";

export default function useCreateAssignmentMutation() {
  const mutation = useCreateAssignment();

  return {
    ...mutation,
    createAssignment: mutation.mutateAsync,
  };
}
