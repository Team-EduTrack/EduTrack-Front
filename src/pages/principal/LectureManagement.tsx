import { useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import Table from "../../components/common/Table";
import FormInput from "../../components/common/Input";
import MakeLectureModal from "../../components/common/principal/MakeLectureModal";
import { Link } from "react-router-dom";

const mockLectures = [
  {
    id: 1,
    name: "재미있는 영어",
    teacher: "김예린",
    studentCount: 30,
    averageGrade: 63,
  },
  {
    id: 2,
    name: "영문법 수업",
    teacher: "박우성",
    studentCount: 20,
    averageGrade: 98,
  },
  {
    id: 3,
    name: "보카 독파",
    teacher: "김영아",
    studentCount: 33,
    averageGrade: 74,
  },
];

export default function PrincipalLectureManagement() {
  const [makeLectureModalOpen, setMakeLectureModalOpen] = useState(false);
  const [lectures, setLectures] = useState(mockLectures);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

    setLectures((prev) =>
      prev.filter((lecture) => !selectedIds.includes(lecture.id))
    );

    setSelectedIds([]);
  };

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
              >
                추가
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteLecture}>
                삭제
              </Button>
            </div>
          </div>
          <Table
            columns={[
              {
                header: (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIds.length === lectures.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(lectures.map((l) => l.id)); //
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                ),
                accessor: (lecture) => (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIds.includes(lecture.id)}
                    onChange={() => toggleSelect(lecture.id)}
                  />
                ),
                className: "w-12 text-center",
              },

              {
                header: "",
                accessor: (_, index) => index + 1,
                className: "text-left",
              },
              {
                header: "강의명",
                accessor: (lecture) => (
                  <Link
                    to={`/principal/lectures/${lecture.id}`}
                    className="hover:underline"
                  >
                    {lecture.name}
                  </Link>
                ),
                className: "text-center",
              },
              {
                header: "담당 강사",
                accessor: (lecture) => lecture.teacher,
                className: "text-center",
              },
              {
                header: "수강생",
                accessor: (lecture) => lecture.studentCount,
                className: " text-center",
              },
              {
                header: "평균 성적",
                accessor: (lecture) => lecture.averageGrade,
                className: " text-center",
              },
            ]}
            data={lectures}
            keyExtractor={(lecture) => lecture.id}
            emptyMessage="등록된 강의가 없습니다."
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
        onSubmit={(newLecture) => {
          setLectures((prev) => [...prev, newLecture]);
        }}
      />
    </Page>
  );
}
