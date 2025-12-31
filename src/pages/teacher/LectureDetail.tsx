import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import LectureHeader from "../../components/common/LectureHeader";
import CircleProgress from "../../components/common/CircleProgress";
import StatBox from "../../components/common/StatBox";
import ScoreBox from "../../components/common/ScoreBox";
import AddStudentModal from "../../components/teacher/AddStudentModal";
import { useLectureDetail, useAssignStudents } from "../../hooks/teacher";

import UserPagination from "../../components/common/principal/UserPagination";

export default function LectureDetail() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const lectureIdNum = Number(lectureId);
  const queryClient = useQueryClient();

  const { lectureDetail, statistics, isLoading, isError } =
    useLectureDetail(lectureIdNum);
  const { assignStudents, isPending: isAssigning } = useAssignStudents();

  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const students = lectureDetail?.studentDetails ?? [];
  const assignments = lectureDetail?.assignmentsWithSubmissions ?? [];
  const exams = lectureDetail?.examsWithParticipation ?? [];

  const pageSize = 10;
  const [studentPage, setStudentPage] = useState(1);
  const studentTotalPages = Math.max(1, Math.ceil(students.length / pageSize));

  const pagedStudents = useMemo(() => {
    const start = (studentPage - 1) * pageSize;
    return students.slice(start, start + pageSize);
  }, [students, studentPage]);

  const handleSelectAll = (checked: boolean) => {
    const pageIds = pagedStudents.map((s) => s.id!).filter(Boolean);

    if (checked) {
      setSelectedStudents((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelectedStudents((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) =>
        prev.includes(studentId) ? prev : [...prev, studentId]
      );
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleDeleteStudents = () => {
    if (selectedStudents.length === 0) return;
    alert("학생 삭제 기능은 현재 API에서 지원하지 않습니다.");
  };

  const handleAddStudents = async (studentIds: number[]) => {
    try {
      await assignStudents({
        lectureId: lectureIdNum,
        data: { studentIds },
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lectures"] });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to assign students:", error);
      alert("학생 배정에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Page>
    );
  }

  if (isError || !lectureDetail) {
    return (
      <Page>
        <Card>
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        </Card>
      </Page>
    );
  }

  const attendanceRate = statistics?.attendanceRate ?? 0;
  const submissionRate = statistics?.assignmentSubmissionRate ?? 0;

  return (
    <Page>
      <div className="space-y-8">
        <Card>
          <LectureHeader
            thumbnail={lectureDetail.imageUrl ?? undefined}
            name={lectureDetail.title ?? ""}
            description={lectureDetail.description ?? ""}
          />
        </Card>

        <Card title="강의 진행 현황">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="출석률">
              <CircleProgress value={Math.round(attendanceRate)} />
            </StatBox>

            <StatBox label="과제 제출률">
              <span className="text-lg font-semibold text-gray-900">
                {submissionRate.toFixed(1)}%
              </span>
            </StatBox>

            <StatBox label="수강생 수">
              <span className="text-lg font-semibold text-gray-900">
                {lectureDetail.studentCount ?? 0}명
              </span>
            </StatBox>
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
                disabled={isAssigning}
              >
                {isAssigning ? "추가 중..." : "추가"}
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
                      pagedStudents.length > 0 &&
                      pagedStudents.every((s) =>
                        selectedStudents.includes(s.id!)
                      )
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                ),
                accessor: (student) => (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedStudents.includes(student.id!)}
                    onChange={(e) =>
                      handleSelectStudent(student.id!, e.target.checked)
                    }
                  />
                ),
                className: "w-12",
              },
              {
                header: "",
                accessor: (_, index) =>
                  (studentPage - 1) * pageSize + index + 1,
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
            ]}
            data={pagedStudents}
            keyExtractor={(student) => student.id!}
            emptyMessage="등록된 학생이 없습니다."
          />

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              총 {students.length}명 · {studentTotalPages}페이지 · 현재{" "}
              {studentPage}페이지
            </div>

            <UserPagination
              page={studentPage}
              lastPage={studentTotalPages}
              onChange={(p) => setStudentPage(p)}
              maxButtons={5}
            />
          </div>
        </Card>

        <Card title="과제 제출">
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">생성된 과제가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.assignmentId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {assignment.assignmentTitle}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    제출: {assignment.submittedStudents?.length ?? 0}명
                  </p>
                  <div className="space-y-2">
                    {assignment.submittedStudents
                      ?.slice(0, 3)
                      .map((student) => (
                        <ScoreBox
                          key={student.submissionId}
                          label={student.studentName ?? ""}
                          action={
                            <Link
                              to={`/teacher/assignments/${assignment.assignmentId}/submissions/${student.submissionId}`}
                            >
                              <Button variant="neutral" size="sm">
                                채점하기
                              </Button>
                            </Link>
                          }
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="생성된 시험">
          {exams.length === 0 ? (
            <p className="text-sm text-gray-500">생성된 시험이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {exams.map((exam) => (
                <ScoreBox
                  key={exam.examId}
                  label={exam.examTitle ?? ""}
                  value={`${exam.participatedCount ?? 0} / ${
                    exam.totalStudentCount ?? 0
                  }명 응시`}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudents}
        lectureId={lectureIdNum}
      />
    </Page>
  );
}
