import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import PageTitle from "../../components/common/PageTitle";
import LectureCard from "../../components/common/LectureCard";

const mockLectures = [
  { id: 1, name: "재미있는 영어", studentCount: 30 },
  { id: 2, name: "영문법 수업", studentCount: 20 },
  { id: 3, name: "보카 독파", studentCount: 33 },
];

export default function LectureManagement() {
  return (
    <Page>
      <PageTitle title="내 강의 리스트" className="mb-6" />
      <Card>
        <div className="space-y-4">
          {mockLectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              name={lecture.name}
              studentCount={lecture.studentCount}
              linkTo={`/teacher/lectures/${lecture.id}`}
            />
          ))}
        </div>
      </Card>
    </Page>
  );
}
