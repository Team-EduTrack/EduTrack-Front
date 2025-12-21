import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ViewMore from "../../components/ViewMore";
import Card from "../../components/common/Card";
import LectureHeader from "../../components/common/LectureHeader";
import ListItem from "../../components/common/ListItem";
import Page from "../../components/common/Page";
import StatBox from "../../components/common/StatBox";
import { useGetMyLectureDetail } from "../../api/generated/edutrack";
import useMyExams from "../../hooks/student/useMyExams";
import useLectureAssignments from "../../hooks/student/useLectureAssignment";

export default function StudentLectureDetail() {
  const { lectureId } = useParams();
  const id = Number(lectureId);

  const lectureDetailQuery = useGetMyLectureDetail(id, {
    query: { enabled: Number.isFinite(id) && id > 0 },
  });

  const lectureDetail = lectureDetailQuery.data?.data;

  const { exams: allMyExams, isLoading: isExamsLoading } = useMyExams();

  const { assignments: lectureAllAssignments } = useLectureAssignments(id);

  const lectureTitle = lectureDetail?.lectureTitle?.trim() ?? "";

  const lectureAllExams = useMemo(() => {
    if (!lectureTitle) return [];
    return allMyExams.filter((e) => e.lectureTitle?.trim() === lectureTitle);
  }, [allMyExams, lectureTitle]);

  const totalExamCount = lectureAllExams.length;
  const totalAssignmentCount = lectureAllAssignments.length;

  const unTakenExamCount = lectureDetail?.exams?.length ?? 0;
  const unSubmittedAssignmentCount = lectureDetail?.assignments?.length ?? 0;

  const takenExamCount = Math.max(0, totalExamCount - unTakenExamCount);
  const submittedAssignmentCount = Math.max(
    0,
    totalAssignmentCount - unSubmittedAssignmentCount
  );

  const isLoading = lectureDetailQuery.isLoading;

  return (
    <Page>
      <div className="space-y-4">
        <Card>
          <div className="flex justify-between items-start">
            <LectureHeader
              name={lectureDetail?.lectureTitle ?? ""}
              description={lectureDetail?.description ?? ""}
            />

            <span className="text-sm text-gray-500 ml-6 mt-1 whitespace-nowrap">
              {lectureDetail?.teacherName} 강사님
            </span>
          </div>
        </Card>

        <Card title="강의 성취도 분석">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="출석률">
              {isLoading
                ? "불러오는 중…"
                : `${lectureDetail?.attendanceRate ?? 0}%`}
            </StatBox>

            <StatBox label="시험 응시">
              {isExamsLoading
                ? "불러오는 중…"
                : `${takenExamCount} / ${totalExamCount}`}
            </StatBox>

            <StatBox label="과제 제출">
              {isLoading
                ? "불러오는 중…"
                : `${submittedAssignmentCount} / ${totalAssignmentCount}`}
            </StatBox>
          </div>
        </Card>

        <section className="flex space-x-4">
          <Card className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">시험</h3>
              <ViewMore to="/student/tasks" />
            </div>

            {isExamsLoading ? (
              <p>불러오는 중...</p>
            ) : lectureAllExams.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 시험이 없습니다.</p>
            ) : (
              <ul className="space-y-1">
                {lectureAllExams.map((exam) => (
                  <ListItem key={exam.examId}>{exam.title}</ListItem>
                ))}
              </ul>
            )}
          </Card>

          <Card className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">과제</h3>
              <ViewMore to="/student/tasks" />
            </div>

            {isLoading ? (
              <p>불러오는 중...</p>
            ) : lectureAllAssignments.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 과제가 없습니다.</p>
            ) : (
              <ul className="space-y-1">
                {lectureAllAssignments.slice(0, 2).map((assignment) => (
                  <ListItem key={assignment.assignmentId}>
                    {assignment.title}
                  </ListItem>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </Page>
  );
}
