import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import LectureList from "../../components/common/student/LectureList";

const mockLectures = [
  { id: 1, title: "영문법 수업", teacher: "김은아" },
  { id: 2, title: "보카 독파", teacher: "박상기" },
  { id: 3, title: "리딩 바이트", teacher: "이자은" },
  { id: 4, title: "그래머 인 유즈", teacher: "김민지" },
  { id: 5, title: "내신 콘서트 영어 능률", teacher: "강은경" },
];

export default function StudentLectureList() {
  return (
    <Page>
      <PageTitle title="내 강의 리스트" className="mb-6"></PageTitle>
      <Card>
        <div className="space-y-4">
          {mockLectures.map((lecture) => (
            <LectureList
              key={lecture.id}
              name={lecture.title}
              linkTo={`/student/lectures/${lecture.id}`}
            >
              <div className="text-sm mr-20">{lecture.teacher} 강사님</div>
            </LectureList>
          ))}
        </div>
      </Card>
    </Page>
  );
}
