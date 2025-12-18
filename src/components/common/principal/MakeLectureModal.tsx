import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { FiCalendar } from "react-icons/fi";
import {
  useCreateLecture,
  useSearchUsers,
  type LectureCreationRequest,
  type SearchUsersParams,
  type UserSearchResultResponse,
  type LectureCreationRequestDaysOfWeekItem,
} from "../../../api/generated/edutrack";
import Button from "../Button";
import FormInput from "../Input";
import Modal from "../Modal";
import { roleToKorean } from "../../../utils/role";

type DayOfWeek = LectureCreationRequestDaysOfWeekItem;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  academyId: number;
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

const DAY_MAP: Record<string, DayOfWeek> = {
  월: "MONDAY",
  화: "TUESDAY",
  수: "WEDNESDAY",
  목: "THURSDAY",
  금: "FRIDAY",
  토: "SATURDAY",
  일: "SUNDAY",
};

export default function MakeLectureModal({
  isOpen,
  onClose,
  onSaved,
  academyId,
}: Props) {
  const createLecture = useCreateLecture();

  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [teacherId, setTeacherId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [teacherKeyword, setTeacherKeyword] = useState("");
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false);

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

  const daysOfWeek = useMemo(() => {
    return days.map((d) => DAY_MAP[d]).filter((d): d is DayOfWeek => !!d);
  }, [days]);

  const searchParams = useMemo(
    () => ({ keyword: teacherKeyword }) as SearchUsersParams,
    [teacherKeyword]
  );

  const { data: searchData, isFetching, isError, refetch } = useSearchUsers(
    academyId,
    searchParams,
    { query: { enabled: false } }
  );

  const candidates = useMemo(() => {
    const users = (searchData?.data ?? []) as UserSearchResultResponse[];
    const teachers = users.filter((u) => u.role === "TEACHER");
    return teachers.length > 0 ? teachers : users;
  }, [searchData]);

  const openTeacherPicker = () => {
    setTeacherPickerOpen(true);
    setTeacherKeyword((prev) => prev.trim() || teacher.trim());
    setTimeout(() => refetch(), 0);
  };

  const selectTeacher = (user: UserSearchResultResponse) => {
    if (!user.id) {
      alert("선택한 사용자에서 teacherId를 찾지 못했습니다.");
      return;
    }
    setTeacher(user.name ?? "");
    setTeacherId(user.id);
    setTeacherPickerOpen(false);
  };

  const canSubmit = useMemo(() => {
    return (
      name.trim() !== "" &&
      teacherId !== "" &&
      daysOfWeek.length >= 1 &&
      startDate !== "" &&
      endDate !== "" &&
      startDate <= endDate
    );
  }, [name, teacherId, daysOfWeek.length, startDate, endDate]);

  const handleCreate = async () => {
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

    const payload: LectureCreationRequest = {
      title: name.trim(),
      description: description.trim() || null,
      teacherId: Number(teacherId),
      daysOfWeek,
      startDate: `${startDate}T00:00:00`,
      endDate: `${endDate}T23:59:59`,
    };

    try {
      await createLecture.mutateAsync({ data: payload });
      alert("강의가 생성되었습니다.");
      onSaved();
      handleClose();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      alert(error.response?.data?.message ?? "강의 생성에 실패했습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="강의 생성하기" size="lg">
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

        {/* 담당 강사 */}
        <div className="flex gap-3 items-end justify-between">
          <div className="flex-1">
            <FormInput
              label="담당 강사"
              placeholder="찾기 버튼으로 선택하세요"
              className="w-full"
              value={teacher}
              onChange={(e) => {
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

        {/* 강사 검색 패널 */}
        {teacherPickerOpen && (
          <div className="border rounded-lg p-3 bg-white space-y-2">
            <div className="flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="강사 이름/아이디로 검색"
                value={teacherKeyword}
                onChange={(e) => setTeacherKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && refetch()}
              />
              <Button type="button" onClick={() => refetch()}>
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

            {isFetching && (
              <p className="text-sm text-gray-500">검색 중...</p>
            )}

            {isError && (
              <p className="text-sm text-red-500">사용자 검색에 실패했습니다.</p>
            )}

            {!isFetching && candidates.length === 0 && (
              <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
            )}

            <div className="max-h-56 overflow-auto space-y-2">
              {candidates.map((user, idx) => (
                <button
                  key={user.id ?? idx}
                  type="button"
                  className="w-full text-left border rounded-lg px-3 py-2 hover:bg-gray-50"
                  onClick={() => selectTeacher(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{user.name ?? "-"}</div>
                    <div className="text-xs text-gray-500">
                      {roleToKorean(user.role)} / ID: {user.id ?? "-"}
                    </div>
                  </div>
                </button>
              ))}
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
            {DAYS.map((day) => (
              <label key={day} className="flex items-center gap-1 cursor-pointer">
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
