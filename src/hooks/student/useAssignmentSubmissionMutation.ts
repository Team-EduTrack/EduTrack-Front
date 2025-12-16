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

      // 1) 파일 있으면 presigned-url 발급 + S3 PUT 업로드
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

        // presigned URL로 실제 업로드 (PUT)
        await axios.put(url!, file, {
          headers: { "Content-Type": file.type },
        });
      }

      // 2) 제출 API 호출 (백엔드가 fileKey 저장)
      const submitReq: AssignmentSubmitRequest = {
        fileKey,          // 파일 없으면 undefined (백엔드가 허용해야 함)
        comment: content, // 네 content를 comment로 매핑
      };

      const res = await axios.post<AssignmentSubmitResponse>(
        `/api/academies/${academyId}/assignments/${assignmentId}/submissions/submit`,
        submitReq
      );

      return res.data;
    },
  });

  return mutation; // { mutate, mutateAsync, isPending, ... }
}
