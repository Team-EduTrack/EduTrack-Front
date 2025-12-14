import { useCheckIn } from "../../api/generated/edutrack";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import { useState } from "react";

export default function useStudentCheckIn() {
  const auth = useRecoilValue(authState);
  const studentId = auth.user?.id;

  const [checkedIn, setCheckedIn] = useState(false);

  const { mutate, isPending } = useCheckIn();

  const checkIn = () => {
    if (!studentId || checkedIn) return;

    mutate(
        { studentId },
        {
            onSuccess: ({ data }) => {
                if (data.alreadyCheckedIn) {
                  
                  setCheckedIn(true);
                  alert("이미 오늘 출석을 완료했습니다.");
                  return;
                }
      
                setCheckedIn(true);
                alert("출석이 완료되었습니다.");
          },
          onError: () => {
            alert("출석 처리 중 오류가 발생했습니다.");
          },
        }
      );
  };

  return {
    checkIn,
    isLoading: isPending,
    checkedIn,
  };
}
