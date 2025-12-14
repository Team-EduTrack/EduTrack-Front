import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import ViewMore from "../../components/ViewMore";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ListItem from "../../components/common/ListItem";
import Page from "../../components/common/Page";
import LectureList from "../../components/common/student/LectureList";
import useMyLectures from "../../hooks/student/useMyLectures";
import useMyExams from "../../hooks/student/useMyExams";
import useMyAssignments from "../../hooks/student/useMyAssignments";
import useStudentCheckIn from "../../hooks/student/useStudentCheckIn";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const { lectures, isLoading: isLecturesLoading } = useMyLectures();
  const { exams, isLoading: isExamsLoading } = useMyExams();
  const { assignments, isLoading: isAssignmentsLoading } = useMyAssignments();
  const { checkIn, isLoading, checkedIn } = useStudentCheckIn();

  return (
    <Page>
      <div className="space-y-4">
        <Card className="flex justify-between p-8">
          <h2 className="font-extrabold text-3xl">
            {auth.user?.name} <span className="font-bold text-2xl">학생</span>
          </h2>
          <Button
            onClick={checkIn}
            disabled={isLoading || checkedIn}
            variant={checkedIn ? "secondary" : "primary"}
          >
            {checkedIn ? "출석 완료" : isLoading ? "출석 처리중" : "출석하기"}
          </Button>
        </Card>

        <section className="flex gap-4">
          <Card className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">수강중인 강의</h3>
              <ViewMore to="/student/lectures" />
            </div>
            <div className="space-y-4">
              {isLecturesLoading ? (
                <p>불러오는 중…</p>
              ) : !lectures || lectures.length === 0 ? (
                <p className="text-sm text-gray-500">
                  수강중인 강의가 없습니다.
                </p>
              ) : (
                lectures
                  .slice(0, 2)
                  .map((lecture) => (
                    <LectureList
                      key={lecture.lectureId}
                      name={lecture.lectureTitle ?? ""}
                      variant="small"
                    />
                  ))
              )}
            </div>
          </Card>

          <Card className="flex-1">
            <div className="space-y-6">
              <article>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">시험</h3>
                  <ViewMore to="/student/tasks" />
                </div>
                {isExamsLoading ? (
                  <p className="text-sm text-gray-500">불러오는 중…</p>
                ) : exams.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    응시 가능한 시험이 없습니다.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {exams.slice(0, 2).map((exam) => (
                      <ListItem key={exam.examId}>
                        {exam.title ?? "시험 제목 없음"}
                      </ListItem>
                    ))}
                  </ul>
                )}
              </article>

              <article>
                <h3 className="font-semibold text-lg">과제</h3>
                {isAssignmentsLoading ? (
                  <p className="text-sm text-gray-500">불러오는 중…</p>
                ) : assignments.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    제출해야 할 과제가 없습니다.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {assignments.slice(0, 2).map((assignment) => (
                      <ListItem key={assignment.assignmentId}>
                        {assignment.title ?? "과제 제목 없음"}
                      </ListItem>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </Card>
        </section>
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">성적 리포트</h3>
              <ViewMore to="/student/grades" />
            </div>
            {isLecturesLoading ? (
              <p className="text-sm text-gray-500">불러오는 중…</p>
            ) : !lectures || lectures.length === 0 ? (
              <p className="text-sm text-gray-500">
                조회 가능한 성적이 없습니다.
              </p>
            ) : (
              lectures.slice(0, 2).map((lecture) => (
                <LectureList
                  key={lecture.lectureId}
                  name={lecture.lectureTitle ?? ""}
                  variant="compact"
                >
                  <Button
                    size="sm"
                    className="mr-4"
                    onClick={() =>
                      navigate(`/student/grades/${lecture.lectureId}`)
                    }
                  >
                    성적 조회하기
                  </Button>
                </LectureList>
              ))
            )}
          </div>
        </Card>
      </div>
    </Page>
  );
}
