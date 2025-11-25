import { useState } from "react";
import { Link } from "react-router-dom";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import LectureHeader from "../../components/common/LectureHeader";
import CircleProgress from "../../components/common/CircleProgress";
import StatBox from "../../components/common/StatBox";
import ScoreBox from "../../components/common/ScoreBox";
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
  description: "알파벳부터 간단한 회화까지, 초등 저학년도 재미있게 배울 수 있는 영어 기초 강의입니다.",
  thumbnail: "/images/lecture-thumbnail.png",
  progress: 65,
  assignmentSubmitted: 4,
  assignmentTotal: 5,
};

const mockStudents: Student[] = [
  { id: 1, name: "김민준", attendanceRate: "92%", assignmentSubmitted: true },
  { id: 2, name: "이서연", attendanceRate: "88%", assignmentSubmitted: true },
  { id: 3, name: "박지훈", attendanceRate: "75%", assignmentSubmitted: false },
  { id: 4, name: "최수아", attendanceRate: "95%", assignmentSubmitted: true },
  { id: 5, name: "정예준", attendanceRate: "68%", assignmentSubmitted: false },
];

const mockAssignments = [
  { id: 1, studentName: "김민준" },
  { id: 2, studentName: "이서연" },
  { id: 3, studentName: "최수아" },
  { id: 4, studentName: "강도현" },
];

const mockExams = [
  { id: 1, name: "1차 지필평가", score: 18, total: 20 },
  { id: 2, name: "2차 지필평가", score: 15, total: 20 },
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
      <div className="space-y-8">
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

            <div className="border border-gray-200 rounded-lg p-4" />
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
                header: (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={
                      selectedStudents.length === students.length &&
                      students.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                ),
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
                accessor: (_, index) => index + 1,
                className: "w-16",
              },
              {
                header: "학생명",
                accessor: (student) => (
                  <Link
                    to={`/teacher/students/${student.id}`}
                    className="text-gray-700 hover:text-gray-900 hover:underline"
                  >
                    {student.name}
                  </Link>
                ),
              },
              { header: "출석률", accessor: "attendanceRate" },
              {
                header: "과제 제출",
                accessor: (student) => (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      student.assignmentSubmitted
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {student.assignmentSubmitted ? "제출" : "미제출"}
                  </span>
                ),
              },
            ]}
            data={students}
            keyExtractor={(student) => student.id}
            emptyMessage="등록된 학생이 없습니다."
          />
        </Card>

        <Card title="과제 제출">
          <div className="grid grid-cols-2 gap-4">
            {mockAssignments.map((assignment) => (
              <ScoreBox
                key={assignment.id}
                label={assignment.studentName}
                action={
                  <Link to={`/teacher/assignments/${assignment.id}`}>
                    <Button variant="neutral" size="sm">
                      과제 채점하기
                    </Button>
                  </Link>
                }
              />
            ))}
          </div>
        </Card>

        <Card title="생성된 시험">
          <div className="grid grid-cols-2 gap-4">
            {mockExams.map((exam) => (
              <ScoreBox
                key={exam.id}
                label={exam.name}
                value={`${exam.score} / ${exam.total}`}
              />
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
