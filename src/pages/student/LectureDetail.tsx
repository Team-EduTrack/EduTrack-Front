import { useParams } from "react-router-dom";
import ViewMore from "../../components/ViewMore";
import Card from "../../components/common/Card";
import LectureHeader from "../../components/common/LectureHeader";
import ListItem from "../../components/common/ListItem";
import Page from "../../components/common/Page";
import StatBox from "../../components/common/StatBox";
import useMyLectures from "../../hooks/student/useMyLectures";
import useAssignmentSubmissionRate from "../../hooks/student/useAssignmentSubmissionRate";
import useMyExams from "../../hooks/student/useMyExams";
import useLectureAssignments from "../../hooks/student/useLectureAssignment";

export default function StudentLectureDetail() {
  const { lectureId } = useParams();
  const { lectures } = useMyLectures();
  const lecture = lectures.find((l) => l.lectureId === Number(lectureId));
  const {
    submitted,
    total,
    isLoading: isAssignmentLoading,
  } = useAssignmentSubmissionRate(Number(lectureId));
  const { exams, isLoading: isExamsLoading } = useMyExams();
  const lectureExams = exams.filter(
    (exam) => exam.lectureTitle?.trim() === lecture?.lectureTitle?.trim()
  );
  const { assignments, isLoading: isAssignmentsLoading2 } =
    useLectureAssignments(Number(lectureId));

  return (
    <Page>
      <div className="space-y-4">
        <Card>
          <div className="flex justify-between items-start">
            <LectureHeader
              name={lecture?.lectureTitle ?? ""}
              level={"-"}
              description={"설명 준비중입니다."}
              thumbnail={""}
              //백엔드 수정 필요
              //level={lecture?.level ?? ""}
              //description={lecture?.description ?? ""}
              //thumbnail={lecture?.thumbnail ?? ""}
            />

            <span className="text-sm text-gray-500 ml-6 mt-1 whitespace-nowrap">
              {lecture?.teacherName} 강사님
            </span>
          </div>
        </Card>
        <Card title="강의 성취도 분석">
          <div className="grid grid-cols-3 gap-4 ">
            <StatBox label="진도율">{"-"}%</StatBox>
            <StatBox label="출석률">{"-"}%</StatBox>

            <StatBox label="과제 제출">
              {isAssignmentLoading ? "불러오는 중…" : `${submitted} / ${total}`}
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
            ) : lectureExams.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 시험이 없습니다.</p>
            ) : (
              <ul className="space-y-1">
                {lectureExams.map((exam) => (
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

            {isAssignmentsLoading2 ? (
              <p>불러오는 중...</p>
            ) : assignments.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 과제가 없습니다.</p>
            ) : (
              <ul className="space-y-1">
                {assignments.slice(0, 2).map((assignment) => (
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
