import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import ViewMore from "../../components/ViewMore";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ListItem from "../../components/common/ListItem";
import Page from "../../components/common/Page";
import LectureList from "../../components/common/student/LectureList";
import useMyLectures from "../../hooks/useMyLectures";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const { lectures, isLoading: isLecturesLoading } = useMyLectures();

  const enrolledLectures = [
    { id: 1, title: "영문법 특강" },
    { id: 2, title: "재미있는 영어" },
  ];

  const tasks = {
    exams: [
      { id: 101, lectureTitle: "재미있는 영어", title: "1차 지필평가" },
      { id: 102, lectureTitle: "재미있는 영어", title: "2차 지필평가" },
      { id: 103, lectureTitle: "재미있는 영어", title: "3차 지필평가" },
    ],
    assignments: [
      { id: 201, lectureTitle: "보카 독해", title: "독후감 쓰기" },
      { id: 202, lectureTitle: "보카 독해", title: "단어 10번 쓰기" },
      { id: 203, lectureTitle: "보카 독해", title: "원서 해석본 제출" },
    ],
  };

  return (
    <Page>
      <div className="space-y-4">
        <Card className="flex justify-between p-8">
          <h2 className="font-extrabold text-3xl">
            {auth.user?.name} <span className="font-bold text-2xl">학생</span>
          </h2>
          <Button>출석하기</Button>
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
                <ul className="space-y-1">
                  {tasks.exams.slice(0, 2).map((exam) => (
                    <ListItem key={exam.id}>{exam.title}</ListItem>
                  ))}
                </ul>
              </article>

              <article>
                <h3 className="font-semibold text-lg">과제</h3>
                <ul className="space-y-1">
                  {tasks.assignments.slice(0, 2).map((assignment) => (
                    <ListItem key={assignment.id}>{assignment.title}</ListItem>
                  ))}
                </ul>
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
            {enrolledLectures.slice(0, 2).map((lecture) => (
              <LectureList
                key={lecture.id}
                name={lecture.title}
                variant="compact"
              >
                <Button
                  size="sm"
                  className="mr-4"
                  onClick={() => navigate(`/student/grades/${lecture.id}`)}
                >
                  성적 조회하기
                </Button>
              </LectureList>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}
