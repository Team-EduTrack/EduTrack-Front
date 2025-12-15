import { useState } from "react";
import Card from "../Card";
import LectureList from "./LectureList";
import Button from "../Button";
import Table, { type Column } from "../Table";
import { useNavigate } from "react-router-dom";
import useLectureAssignments from "../../../hooks/student/useLectureAssignment";
import { mapAssignment } from "../../../utils/mappers/assignmentMapper";

interface Lecture {
  id: number;
  title: string;
  teacher: string;
}

export interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: "미제출" | "제출완료";
}

export interface Exam {
  id: number;
  title: string;
  endDate: string;
  duration: number;
  status: "응시 가능" | "응시 완료" | "기간 만료";
}

export default function TaskCard({
  lecture,
  exams,
}: {
  lecture: Lecture;
  exams: Exam[];
}) {
  const [openType, setOpenType] = useState<"assignment" | "exam" | null>(null);
  const navigate = useNavigate();
  const { assignments: rawAssignments } = useLectureAssignments(lecture.id);

  const lectureAssignments = rawAssignments.map(mapAssignment);

  const assignmentColumns: Column<Assignment>[] = [
    {
      header: "번호",
      accessor: (_: Assignment, idx: number) => idx + 1,
      className: "w-20 text-center",
    },
    {
      header: "과제명",
      accessor: "title",
      className: "text-left px-4",
    },
    {
      header: "마감일",
      accessor: (row) => row.dueDate,
      className: "text-center",
    },
    {
      header: "상태",
      accessor: (row) => (
        <span
          className={
            row.status === "제출완료"
              ? "text-green-600 font-semibold"
              : "text-red-700 font-semibold"
          }
        >
          {row.status}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "",
      accessor: (row) => (
        <Button
          size="sm"
          disabled={row.status === "제출완료"}
          onClick={() => navigate(`/student/tasks/assignment/${row.id}`)}
        >
          {row.status === "제출완료" ? "제출완료" : "제출하기"}
        </Button>
      ),
      className: "text-right pr-4",
    },
  ];

  const examColumns: Column<Exam>[] = [
    {
      header: "번호",
      accessor: (_: Exam, idx: number) => idx + 1,
      className: "w-20 text-center",
    },
    {
      header: "시험명",
      accessor: "title",
      className: "text-left px-4",
    },
    {
      header: "마감기간",
      accessor: (row) => row.endDate,
      className: "text-center",
    },
    {
      header: "시험시간",
      accessor: (row) => `${row.duration}분`,
      className: "text-center",
    },
    {
      header: "상태",
      accessor: (row) => (
        <span
          className={
            row.status === "응시 완료"
              ? "text-green-600 font-semibold"
              : row.status === "기간 만료"
              ? "text-gray-400 font-semibold"
              : "text-blue-600 font-semibold"
          }
        >
          {row.status}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "",
      accessor: (row) => (
        <Button
          size="sm"
          disabled={row.status !== "응시 가능"}
          onClick={() => navigate(`/student/tasks/exam/${row.id}`)}
        >
          응시하기
        </Button>
      ),
      className: "text-right pr-4",
    },
  ];

  return (
    <Card>
      <LectureList name={lecture.title} variant="small">
        <div className="grid grid-cols-2 w-full items-center">
          <span className="text-sm text-gray-500 mr-40">
            {lecture.teacher} 강사님
          </span>

          <div className="flex justify-end gap-4 mr-4">
            <Button
              onClick={() =>
                setOpenType((prev) =>
                  prev === "assignment" ? null : "assignment"
                )
              }
            >
              과제
            </Button>
            <Button
              onClick={() =>
                setOpenType((prev) => (prev === "exam" ? null : "exam"))
              }
            >
              시험
            </Button>
          </div>
        </div>
      </LectureList>

      {/* ▼ 과제 */}
      {openType === "assignment" && (
        <div className="mt-4">
          <Table
            columns={assignmentColumns}
            data={lectureAssignments}
            keyExtractor={(row) => row.id}
            emptyMessage="등록된 과제가 없습니다."
          />
        </div>
      )}

      {/* ▼ 시험 */}
      {openType === "exam" && (
        <div className="mt-4">
          <Table
            columns={examColumns}
            data={exams}
            keyExtractor={(row) => row.id}
            emptyMessage="등록된 시험이 없습니다."
          />
        </div>
      )}
    </Card>
  );
}
