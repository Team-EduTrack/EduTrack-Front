import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import ListItem from "../../components/common/ListItem";
import Stat from "../../components/common/Stat";

const mockTeacher = { name: "홍길동" };

const mockLectures = [
  { id: 1, name: "재미있는 영어 수업" },
  { id: 2, name: "보카 독파" },
  { id: 3, name: "영문법 특강" },
];

const mockAttendance = [
  { id: 1, name: "재미있는 영어", present: 16, total: 30 },
  { id: 2, name: "보카 독파", present: 10, total: 20 },
  { id: 3, name: "영문법 특강", present: 9, total: 18 },
];

export default function TeacherDashboard() {
  return (
    <Page>
      <div className="space-y-8">
        <Card>
          <h1 className="text-xl font-semibold text-gray-900">{mockTeacher.name} 강사님</h1>
          <p className="text-sm text-gray-500 mt-1">환영합니다!</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="내 강의 리스트" moreLink="/teacher/lectures">
            <ul className="space-y-1">
              {mockLectures.map((lecture) => (
                <ListItem key={lecture.id}>{lecture.name}</ListItem>
              ))}
            </ul>
          </Card>

          <Card title="수강생 출결 현황">
            <div className="space-y-3">
              {mockAttendance.map((item) => (
                <Stat
                  key={item.id}
                  label={item.name}
                  value={item.present}
                  total={item.total}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
