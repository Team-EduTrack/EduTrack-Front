import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import PageTitle from "../../components/common/PageTitle";
import LectureCard from "../../components/common/LectureCard";

const mockLectures = [
  { id: 1, name: "재미있는 영어", studentCount: 20, thumbnail: "/images/lecture1.png" },
  { id: 2, name: "영문법 수업", studentCount: 18, thumbnail: "/images/lecture2.png" },
  { id: 3, name: "보카 독파", studentCount: 10, thumbnail: "/images/lecture3.png" },
];

export default function GradeManagement() {
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
              thumbnail={lecture.thumbnail}
              linkTo={`/teacher/grades/${lecture.id}`}
            />
          ))}
        </div>
      </Card>
    </Page>
  );
}
