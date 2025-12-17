import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type {
  AssignmentSubmitRequest,
  AssignmentSubmitResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from "../../api/generated/edutrack";

interface SubmitArgs {
  academyId: number;
  assignmentId: number;
  content: string;   // comment로 보냄
  file?: File;
}

export function useSubmitAssignmentMutation() {
  const mutation = useMutation({
    mutationFn: async ({ academyId, assignmentId, content, file }: SubmitArgs) => {
      let fileKey: string | undefined;

      if (file) {
        const presignedReq: PresignedUrlRequest = {
          fileName: file.name,
          contentType: file.type,
        };

        const presignedRes = await axios.post<PresignedUrlResponse>(
          `/api/academies/${academyId}/assignments/${assignmentId}/submissions/presigned-url`,
          presignedReq
        );

        const { url, fileKey: issuedFileKey } = presignedRes.data;
        fileKey = issuedFileKey;

        await axios.put(url!, file, {
          headers: { "Content-Type": file.type },
        });
      }

      const submitReq: AssignmentSubmitRequest = {
        fileKey,         
        comment: content, 
      };

      const res = await axios.post<AssignmentSubmitResponse>(
        `/api/academies/${academyId}/assignments/${assignmentId}/submissions/submit`,
        submitReq
      );

      return res.data;
    },
  });

  return mutation;
}
