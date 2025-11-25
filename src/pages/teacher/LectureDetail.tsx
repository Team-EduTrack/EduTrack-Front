import { useState } from "react";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import LectureHeader from "../../components/common/LectureHeader";
import CircleProgress from "../../components/common/CircleProgress";
import StatBox from "../../components/common/StatBox";
import AddStudentModal from "../../components/teacher/AddStudentModal";

interface Student {
  id: number;
  name: string;
  attendanceRate: string;
  assignmentSubmitted: boolean;
}

const mockLecture = {
  id: 1,
  name: "재미있는 영어",
  level: "초등 저학년",
  description: "초등 저학년도 재미있게 배울 수 있는 영어 강의!",
  thumbnail: "/images/lecture-thumbnail.png",
  progress: 60,
  assignmentSubmitted: 1,
  assignmentTotal: 20,
};

const mockStudents: Student[] = [
  { id: 1, name: "김OO", attendanceRate: "50%", assignmentSubmitted: false },
  { id: 2, name: "이OO", attendanceRate: "80%", assignmentSubmitted: true },
];

const mockAssignments = [
  { id: 1, studentName: "김OO" },
  { id: 2, studentName: "박OO" },
  { id: 3, studentName: "이OO" },
  { id: 4, studentName: "강OO" },
];

const mockExams = [
  { id: 1, name: "1차 지필평가", score: 5, total: 20 },
  { id: 2, name: "2차 지필평가", score: 7, total: 20 },
];

export default function LectureDetail() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleDeleteStudents = () => {
    if (selectedStudents.length === 0) return;
    if (!confirm("선택한 학생을 삭제하시겠습니까?")) return;
    setStudents((prev) => prev.filter((s) => !selectedStudents.includes(s.id)));
    setSelectedStudents([]);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
    setIsAddModalOpen(false);
  };

  return (
    <Page>
      <div className="space-y-6">
        <Card>
          <LectureHeader
            name={mockLecture.name}
            level={mockLecture.level}
            description={mockLecture.description}
            thumbnail={mockLecture.thumbnail}
          />
        </Card>

        <Card title="강의 진행 현황">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="강의 진행률">
              <CircleProgress value={mockLecture.progress} />
            </StatBox>

            <StatBox label="과제 제출">
              <span className="text-lg font-semibold text-gray-900">
                {mockLecture.assignmentSubmitted} / {mockLecture.assignmentTotal}
              </span>
            </StatBox>

            <StatBox label="" className="invisible" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">학생 리스트</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                추가
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteStudents}>
                삭제
              </Button>
            </div>
          </div>
          <Table
            columns={[
              {
                header: "",
                accessor: (student) => (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) =>
                      handleSelectStudent(student.id, e.target.checked)
                    }
                  />
                ),
                className: "w-12",
              },
              {
                header: "",
                accessor: (student) =>
                  students.findIndex((s) => s.id === student.id) + 1,
                className: "w-16",
              },
              { header: "학생명", accessor: "name" },
              { header: "출석률", accessor: "attendanceRate" },
              {
                header: "과제 제출 (y/n)",
                accessor: (student) =>
                  student.assignmentSubmitted ? "y" : "n",
              },
            ]}
            data={students}
            keyExtractor={(student) => student.id}
            emptyMessage="등록된 학생이 없습니다."
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={
                selectedStudents.length === students.length &&
                students.length > 0
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="text-sm text-gray-600">전체 선택</span>
          </div>
        </Card>

        <Card title="과제 제출">
          <div className="grid grid-cols-2 gap-4">
            {mockAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <span className="text-sm text-gray-700">
                  {assignment.studentName}
                </span>
                <Button variant="neutral" size="sm">
                  과제 채점하기
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="생성된 시험">
          <div className="grid grid-cols-2 gap-4">
            {mockExams.map((exam) => (
              <div
                key={exam.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <span className="text-sm text-gray-700">{exam.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {exam.score} / {exam.total}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudent}
        existingStudents={students}
      />
    </Page>
  );
}
