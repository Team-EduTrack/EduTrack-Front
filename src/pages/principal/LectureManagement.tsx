import { useEffect, useMemo, useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import Table from "../../components/common/Table";
import FormInput from "../../components/common/Input";
import MakeLectureModal from "../../components/common/principal/MakeLectureModal";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetLecturesByTeacher,
  getGetLecturesByTeacherQueryKey,
  type LectureForTeacherResponse,
} from "../../api/generated/edutrack";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";

export default function PrincipalLectureManagement() {
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id;

  const qc = useQueryClient();

  const lecturesQuery = useGetLecturesByTeacher();
  console.log("raw axios response:", lecturesQuery.data); // ✅ AxiosResponse 전체
  console.log("rows:", lecturesQuery.data?.data);

  const rows = lecturesQuery.data?.data ?? [];

  const [makeLectureModalOpen, setMakeLectureModalOpen] = useState(false);

  // ✅ UI 삭제(숨김)용
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const lectures = useMemo(() => {
    const list = rows as LectureForTeacherResponse[];
    return list.filter((r) => !deletedIds.includes(r.lectureId ?? -1));
  }, [rows, deletedIds]);

  const [attendanceRate, setAttendanceRate] = useState(0);
  const [examRate, setExamRate] = useState(0);
  const [assignmentRate, setAssignmentRate] = useState(0);

  const total = attendanceRate + examRate + assignmentRate;
  const isValid = total === 100;

  const handleSaveRate = () => {
    if (!isValid) {
      alert("세 비율의 합이 100이 되어야 합니다.");
      return;
    }

    console.log("저장됨:", {
      attendance: attendanceRate,
      exam: examRate,
      assignment: assignmentRate,
    });

    alert("저장 완료!");
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleDeleteLecture = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 강의를 선택하세요.");
      return;
    }

    const confirmDelete = confirm("선택한 강의를 삭제할까요?");
    if (!confirmDelete) return;

    setDeletedIds((prev) => [...prev, ...selectedIds]);
    setSelectedIds([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(
        lectures.map((l) => l.lectureId ?? -1).filter((id) => id !== -1)
      );
    } else {
      setSelectedIds([]);
    }
  };

  const refetchLectures = async () => {
    // ✅ orval queryKey로 invalidate
    await qc.invalidateQueries({ queryKey: getGetLecturesByTeacherQueryKey() });
  };

  useEffect(() => {
    fetch("/api/lectures/6")
      .then((r) => r.json().then((d) => ({ status: r.status, d })))
      .then(console.log);
  }, []);

  return (
    <Page>
      <div className="space-y-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              강의 리스트
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMakeLectureModalOpen(true)}
                disabled={lecturesQuery.isLoading}
              >
                추가
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteLecture}>
                삭제
              </Button>
            </div>
          </div>

          {lecturesQuery.isError && (
            <p className="text-sm text-red-500">
              강의 목록을 불러오지 못했습니다.
            </p>
          )}

          <Table
            columns={[
              {
                header: (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={
                      lectures.length > 0 &&
                      selectedIds.length === lectures.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                ),
                accessor: (lecture: LectureForTeacherResponse) => (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIds.includes(lecture.lectureId ?? -1)}
                    onChange={() => toggleSelect(lecture.lectureId ?? -1)}
                  />
                ),
                className: "w-12 text-center",
              },
              {
                header: "",
                accessor: (_: LectureForTeacherResponse, index: number) =>
                  index + 1,
                className: "text-left",
              },
              {
                header: "강의명",
                accessor: (lecture: LectureForTeacherResponse) => (
                  <Link
                    to={`/principal/lectures/${lecture.lectureId ?? ""}`}
                    className="hover:underline"
                  >
                    {lecture.title ?? "강의명 없음"}
                  </Link>
                ),
                className: "text-center",
              },
              {
                header: "담당 강사",
                accessor: (lecture: LectureForTeacherResponse) =>
                  lecture.teacherName ?? "-",
                className: "text-center",
              },
              {
                header: "수강생",
                accessor: (lecture: LectureForTeacherResponse) =>
                  lecture.studentCount ?? 0,
                className: "text-center",
              },
              {
                header: "평균 성적",
                accessor: (lecture: LectureForTeacherResponse) =>
                  lecture.averageGrade != null
                    ? Number(lecture.averageGrade).toFixed(1)
                    : "-",
                className: "text-center",
              },
            ]}
            data={lectures}
            keyExtractor={(lecture: LectureForTeacherResponse) =>
              lecture.lectureId ?? 0
            }
            emptyMessage={
              lecturesQuery.isLoading
                ? "불러오는 중..."
                : "등록된 강의가 없습니다."
            }
          />
        </Card>

        <Card className="mb-4" title="성적 비율">
          <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
            <div className="flex items-center justify-center">
              <p className="w-10 text-right">출석</p>
              <FormInput
                label=""
                type="number"
                className="ml-4"
                onChange={(e) => setAttendanceRate(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-center">
              <p className="w-10 text-right">시험</p>
              <FormInput
                label=""
                type="number"
                className="ml-4"
                onChange={(e) => setExamRate(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-center">
              <p className="w-10 text-right">과제</p>
              <FormInput
                label=""
                type="number"
                className="ml-4"
                onChange={(e) => setAssignmentRate(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 w-full">
            <Button type="button" onClick={handleSaveRate} disabled={!isValid}>
              저장하기
            </Button>
          </div>
        </Card>
      </div>

      <MakeLectureModal
        isOpen={makeLectureModalOpen}
        onClose={() => setMakeLectureModalOpen(false)}
        onSaved={refetchLectures}
        academyId={academyId}
      />
    </Page>
  );
}
