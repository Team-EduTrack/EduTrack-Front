import { useSubmitAssignment, type AssignmentSubmitRequest, type SubmitAssignmentParams } from "../../api/generated/edutrack";


interface SubmitArgs {
  assignmentId: number;
  content: string;
  file?: File;
}

export function useSubmitAssignmentMutation() {
  const { mutate } = useSubmitAssignment();

  const submit = ({ assignmentId, content, file }: SubmitArgs) => {
    const formData = new FormData();
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    mutate({
      assignmentId,
      data: formData as unknown as AssignmentSubmitRequest,
      params: {} as SubmitAssignmentParams,
    });
  };

  return { submit };
}