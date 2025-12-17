import { useMemo, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import {
  useCreateLecture,
  useSearchUsers,
  type LectureCreationRequest,
  type SearchUsersParams,
  type UserSearchResultResponse,
} from "../../../api/generated/edutrack";
import Button from "../Button";
import FormInput from "../Input";
import Modal from "../Modal";

type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  academyId: number; // ✅ 추가: 사용자 검색에 필요
}

const dayLabelToEnum: Record<string, DayOfWeek> = {
  월: "MONDAY",
  화: "TUESDAY",
  수: "WEDNESDAY",
  목: "THURSDAY",
  금: "FRIDAY",
  토: "SATURDAY",
  일: "SUNDAY",
};

// ✅ 응답이 프로젝트마다 필드명이 조금씩 달라서 안전하게 꺼내는 헬퍼
const pickUserId = (u: any): number | null => {
  const v = u?.userId ?? u?.id ?? u?.memberId ?? null;
  return typeof v === "number" ? v : v != null ? Number(v) : null;
};

const pickUserName = (u: any): string => {
  return (
    u?.name ??
    u?.userName ??
    u?.loginId ??
    u?.username ??
    u?.userId ??
    "이름없음"
  );
};

const pickUserType = (u: any): string => {
  return u?.userType ?? u?.role ?? u?.type ?? "";
};

export default function MakeLectureModal({
  isOpen,
  onClose,
  onSaved,
  academyId,
}: Props) {
  const createLecture = useCreateLecture();

  // ✅ 네 디자인 그대로 state 유지
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState(""); // 표시용(이름)
  const [teacherId, setTeacherId] = useState<number | "">(""); // ✅ API 필수
  const [description, setDescription] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ 강사 검색 UI 상태
  const [teacherKeyword, setTeacherKeyword] = useState("");
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false);

  // 서버가 LocalDateTime이면 이 포맷이 안전
  const toLocalDateTimeStart = (d: string) => `${d}T00:00:00`;
  const toLocalDateTimeEnd = (d: string) => `${d}T23:59:59`;

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const reset = () => {
    setName("");
    setTeacher("");
    setTeacherId("");
    setDescription("");
    setDays([]);
    setStartDate("");
    setEndDate("");
    setTeacherKeyword("");
    setTeacherPickerOpen(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const daysOfWeek: DayOfWeek[] = useMemo(() => {
    return days.map((d) => dayLabelToEnum[d]).filter((day): day is DayOfWeek => day !== undefined);
  }, [days]);

  // ✅ SearchUsersParams 필드명은 프로젝트마다 다를 수 있어서 최소 키워드만 사용
  //    만약 타입 에러 나면 keyword/name/loginId 등 실제 SearchUsersParams 정의에 맞춰 키만 바꿔주면 됨.
  const searchParams = useMemo(() => {
    const p: Partial<SearchUsersParams> = {
      keyword: teacherKeyword,
    };
    return p as SearchUsersParams;
  }, [teacherKeyword]);

  // ✅ 검색은 버튼 눌렀을 때만 (enabled: false + refetch)
  const searchQuery = useSearchUsers(academyId, searchParams, {
    query: { enabled: false },
  });

  const teacherCandidatesRaw: UserSearchResultResponse[] =
    (searchQuery.data?.data as any) ?? [];

  // ✅ 강사만 필터(백엔드가 userType을 내려주면 여기서 걸러짐)
  const teacherCandidates = useMemo(() => {
    return teacherCandidatesRaw.filter((u: any) => {
      const t = pickUserType(u);
      // 흔한 케이스들
      return (
        t === "강사" ||
        t === "TEACHER" ||
        t === "teacher" ||
        t === "ROLE_TEACHER"
      );
    }).length > 0
      ? teacherCandidatesRaw.filter((u: any) => {
          const t = pickUserType(u);
          return (
            t === "강사" ||
            t === "TEACHER" ||
            t === "teacher" ||
            t === "ROLE_TEACHER"
          );
        })
      : teacherCandidatesRaw; // userType이 없으면 전체 보여주고 선택하게
  }, [teacherCandidatesRaw]);

  const openTeacherPicker = async () => {
    setTeacherPickerOpen(true);
    // 현재 입력된 teacher를 기본 키워드로
    setTeacherKeyword((prev) => (prev.trim() ? prev : teacher.trim()));
    // refetch는 teacherKeyword state 반영 후 호출되어야 해서 setTimeout 0
    setTimeout(() => {
      searchQuery.refetch();
    }, 0);
  };

  const selectTeacher = (u: any) => {
    const id = pickUserId(u);
    if (!id) {
      alert("선택한 사용자에서 teacherId를 찾지 못했습니다.");
      return;
    }
    setTeacher(pickUserName(u));
    setTeacherId(id);
    setTeacherPickerOpen(false);
  };

  const canSubmit = useMemo(() => {
    return (
      name.trim() !== "" &&
      teacherId !== "" && // ✅ teacherId 필수
      daysOfWeek.length >= 1 &&
      startDate !== "" &&
      endDate !== "" &&
      startDate <= endDate
    );
  }, [name, teacherId, daysOfWeek.length, startDate, endDate]);

  const handleCreate = async () => {
    console.log("handleCreate clicked", {
      name,
      teacher,
      teacherId,
      days,
      daysOfWeek,
      startDate,
      endDate,
    });

    if (!name.trim()) {
      alert("강의명을 입력해주세요.");
      return;
    }
    if (teacherId === "" || Number.isNaN(Number(teacherId))) {
      alert("담당 강사를 '찾기'로 선택해주세요.");
      return;
    }
    if (daysOfWeek.length < 1) {
      alert("요일을 최소 1개 선택해주세요.");
      return;
    }
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 입력해주세요.");
      return;
    }
    if (startDate > endDate) {
      alert("종료일은 시작일 이후여야 합니다.");
      return;
    }

    const payload: LectureCreationRequest & {
      teacherId: number;
      daysOfWeek: DayOfWeek[];
    } = {
      title: name.trim(),
      description: description.trim() ? description.trim() : null,
      teacherId: Number(teacherId),
      daysOfWeek,
      startDate: toLocalDateTimeStart(startDate),
      endDate: toLocalDateTimeEnd(endDate),
    } as LectureCreationRequest & {
      teacherId: number;
      daysOfWeek: DayOfWeek[];
    };

    try {
      console.log("before mutateAsync");
      const res = await createLecture.mutateAsync({ data: payload });
      console.log("after mutateAsync res:", res);
      alert("강의가 생성되었습니다.");
      onSaved();
      handleClose();
    } catch (err: any) {
      console.log("createLecture error:", err);
      console.log("status:", err?.response?.status);
      console.log("data:", err?.response?.data);
      alert(err?.response?.data?.message ?? "강의 생성에 실패했습니다.");
    }

    // try {
    //   await createLecture.mutateAsync({ data: payload });
    //   alert("강의가 생성되었습니다.");
    //   onSaved();
    //   handleClose();
    // } catch (err: any) {
    //   console.log("createLecture error:", err?.response?.data);
    //   alert(err?.response?.data?.message ?? "강의 생성에 실패했습니다.");
    // }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="강의 생성하기"
      size="lg"
    >
      <div className="space-y-6">
        {/* 강의명 */}
        <div className="flex gap-3 items-end justify-between">
          <div className="flex-1">
            <FormInput
              label="강의명"
              placeholder="강의명을 입력하세요"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* 담당 강사 (디자인 유지) */}
        <div className="flex gap-3 items-end justify-between">
          <div className="flex-1">
            <FormInput
              label="담당 강사"
              placeholder="찾기 버튼으로 선택하세요"
              className="w-full"
              value={teacher}
              onChange={(e) => {
                // 이름을 직접 바꾸면 선택된 teacherId는 무효 처리
                setTeacher(e.target.value);
                setTeacherId("");
              }}
            />
            {teacherId !== "" && (
              <p className="text-xs text-gray-500 mt-1">
                선택된 강사 ID: {teacherId}
              </p>
            )}
          </div>
          <Button type="button" onClick={openTeacherPicker}>
            찾기
          </Button>
        </div>

        {/* ✅ 강사 검색 패널 (같은 모달 안에서만 표시) */}
        {teacherPickerOpen && (
          <div className="border rounded-lg p-3 bg-white space-y-2">
            <div className="flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="강사 이름/아이디로 검색"
                value={teacherKeyword}
                onChange={(e) => setTeacherKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchQuery.refetch();
                }}
              />
              <Button type="button" onClick={() => searchQuery.refetch()}>
                검색
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setTeacherPickerOpen(false)}
              >
                닫기
              </Button>
            </div>

            {searchQuery.isFetching && (
              <p className="text-sm text-gray-500">검색 중...</p>
            )}

            {searchQuery.isError && (
              <p className="text-sm text-red-500">
                사용자 검색에 실패했습니다.
              </p>
            )}

            {!searchQuery.isFetching && teacherCandidates.length === 0 && (
              <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
            )}

            <div className="max-h-56 overflow-auto space-y-2">
              {teacherCandidates.map((u: any, idx: number) => {
                const id = pickUserId(u);
                const nm = pickUserName(u);
                const tp = pickUserType(u);

                return (
                  <button
                    key={`${id ?? "noid"}-${idx}`}
                    type="button"
                    className="w-full text-left border rounded-lg px-3 py-2 hover:bg-gray-50"
                    onClick={() => selectTeacher(u)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{nm}</div>
                      <div className="text-xs text-gray-500">
                        {tp ? tp : "유형 미확인"} / ID: {id ?? "-"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 강의 설명 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            강의 설명
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-24 text-sm"
            placeholder="강의 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 강의 요일 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            요일 선택
          </label>
          <div className="flex justify-between">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <label
                key={day}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={days.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        {/* 시작일 ~ 종료일 */}
        <div className="flex pt-4 pb-2 gap-4">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
              시작
            </span>
            <div className="relative w-full z-9999">
              <input
                type="date"
                className="input input-bordered bg-white pr-10 w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
              />
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
              종료
            </span>
            <div className="relative w-full z-9999">
              <input
                type="date"
                className="input input-bordered bg-white pr-10 w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
              />
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end pt-4">
          <Button
            type="button"
            onClick={handleCreate}
            disabled={!canSubmit || createLecture.isPending}
          >
            생성하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
