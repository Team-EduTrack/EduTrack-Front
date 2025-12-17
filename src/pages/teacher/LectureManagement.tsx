import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import PageTitle from "../../components/common/PageTitle";
import LectureCard from "../../components/common/LectureCard";
import { useTeacherLectures } from "../../hooks/teacher";

export default function LectureManagement() {
  const { lectures, isLoading, isError } = useTeacherLectures();

  if (isLoading) {
    return (
      <Page>
        <PageTitle title="내 강의 리스트" className="mb-6" />
        <Card>
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </Card>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <PageTitle title="내 강의 리스트" className="mb-6" />
        <Card>
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <PageTitle title="내 강의 리스트" className="mb-6" />
      <Card>
        {lectures.length === 0 ? (
          <p className="text-sm text-gray-500">등록된 강의가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {lectures.map((lecture) => (
              <LectureCard
                key={lecture.lectureId}
                name={lecture.title ?? ""}
                studentCount={lecture.studentCount ?? 0}
                linkTo={`/teacher/lectures/${lecture.lectureId}`}
              />
            ))}
          </div>
        )}
      </Card>
    </Page>
  );
}
