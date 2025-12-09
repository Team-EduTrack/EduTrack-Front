import { useRecoilValue } from "recoil";
import { authState } from "../stores/authStore";
import { useGetMyLectures } from "../api/generated/edutrack";

export default function useMyLectures() {
    const auth = useRecoilValue(authState);
    const studentId = auth.user?.id;

    const query = useGetMyLectures(studentId!, {
        query: {
          enabled: !!studentId,
          staleTime: 0,
        },
      });

      return {
        ...query,
        lectures: query.data?.data ?? [], 
      };
    
}