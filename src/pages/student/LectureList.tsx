import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import LectureList from "../../components/common/student/LectureList";
import useMyLectures from "../../hooks/student/useMyLectures";

export default function StudentLectureList() {
  const { lectures, isLoading } = useMyLectures();

  return (
    <Page>
      <PageTitle title="내 강의 리스트" className="mb-6"></PageTitle>
      <Card>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-gray-500">불러오는 중…</p>
          ) : !lectures || lectures.length === 0 ? (
            <p className="text-sm text-gray-500">수강중인 강의가 없습니다.</p>
          ) : (
            lectures.map((lecture) => (
              <LectureList
                key={lecture.lectureId}
                name={lecture.lectureTitle ?? ""}
                linkTo={`/student/lectures/${lecture.lectureId}`}
                thumbnail={lecture.imageUrl}
              >
                <div className="text-sm mr-20">
                  {lecture.teacherName ?? "강사 정보 없음"} 강사님
                </div>
              </LectureList>
            ))
          )}
        </div>
      </Card>
    </Page>
  );
}
