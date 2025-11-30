import ViewMore from "../../components/ViewMore";
import Card from "../../components/common/Card";
import LectureHeader from "../../components/common/LectureHeader";
import ListItem from "../../components/common/ListItem";
import Page from "../../components/common/Page";
import StatBox from "../../components/common/StatBox";

const mockLecture = {
  id: 1,
  name: "영문법 수업",
  level: "중학 기초",
  teacher: "김은아",
  description:
    "이 수업은 중학교 입학 전에 문법을 어떻게 공부해야 할지 고민하는 친구들을 위한 기초 영문법 강의로 중학교 내신대비는 물론, 기초 문법공부로 영단어 실력도 쌓고 영어 말하기에 자신감까지 만들어주는 수업입니다.",
  thumbnail: "",
};

const mockTasks = {
  exams: [
    { id: 101, title: "1차 지필평가" },
    { id: 102, title: "2차 지필평가" },
    { id: 103, title: "3차 지필평가" },
  ],
  assignments: [
    { id: 201, title: "각 챕터 리뷰 페이퍼 제출" },
    { id: 202, title: "단어 10번 쓰기" },
    { id: 203, title: "리딩 파트 해석 과제" },
    { id: 204, title: "영영단어 해석" },
    { id: 205, title: "관계대명사 정리 표 제출" },
  ],
};

const mockLectureStats = {
  attendanceRate: 85,
  progressRate: 60,
  assignmentStatus: {
    submitted: 3,
    total: 5,
  },
};

export default function StudentLectureDetail() {
  return (
    <Page>
      <div className="space-y-4">
        <Card>
          <div className="flex justify-between items-start">
            <LectureHeader
              name={mockLecture.name}
              level={mockLecture.level}
              description={mockLecture.description}
              thumbnail={mockLecture.thumbnail}
            />

            <span className="text-sm text-gray-500 ml-6 mt-1 whitespace-nowrap">
              {mockLecture.teacher} 강사님
            </span>
          </div>
        </Card>
        <Card title="강의 성취도 분석">
          <div className="grid grid-cols-3 gap-4 ">
            <StatBox label="진도율">{mockLectureStats.progressRate}%</StatBox>
            <StatBox label="출석률">{mockLectureStats.attendanceRate}%</StatBox>
            <StatBox label="과제 제출">
              {mockLectureStats.assignmentStatus.submitted} /
              {mockLectureStats.assignmentStatus.total}
            </StatBox>
          </div>
        </Card>

        <section className="flex space-x-4">
          <Card className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">시험</h3>
              <ViewMore to="/student/tasks" />
            </div>
            <ul className="space-y-1">
              {mockTasks.exams.map((exam) => (
                <ListItem key={exam.id}>{exam.title}</ListItem>
              ))}
            </ul>
          </Card>

          <Card className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">과제</h3>
              <ViewMore to="/student/tasks" />
            </div>
            <ul className="space-y-1">
              {mockTasks.assignments.slice(0, 2).map((assignment) => (
                <ListItem key={assignment.id}>{assignment.title}</ListItem>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </Page>
  );
}
