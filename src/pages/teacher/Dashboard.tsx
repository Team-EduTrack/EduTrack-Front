import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import ListItem from "../../components/common/ListItem";
import Stat from "../../components/common/Stat";
import ViewMore from "../../components/ViewMore";
import { useTeacherLectures } from "../../hooks/teacher";

export default function TeacherDashboard() {
  const auth = useRecoilValue(authState);
  const teacherName = auth.user?.name ?? "강사";

  const { lectures, isLoading, isError } = useTeacherLectures();

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card>
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="space-y-8">
        <Card>
          <h1 className="text-xl font-semibold text-gray-900">
            {teacherName} 강사님
          </h1>
          <p className="text-sm text-gray-500 mt-1">환영합니다!</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">내 강의 리스트</h3>
              <ViewMore to="/teacher/lectures" />
            </div>
            {lectures.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 강의가 없습니다.</p>
            ) : (
              <ul className="space-y-1">
                {lectures.slice(0, 5).map((lecture) => (
                  <ListItem key={lecture.lectureId}>{lecture.title}</ListItem>
                ))}
              </ul>
            )}
          </Card>

          <Card title="수강생 현황">
            <div className="space-y-3">
              {lectures.length === 0 ? (
                <p className="text-sm text-gray-500">등록된 강의가 없습니다.</p>
              ) : (
                lectures.slice(0, 5).map((lecture) => (
                  <Stat
                    key={lecture.lectureId}
                    label={lecture.title ?? ""}
                    value={lecture.studentCount ?? 0}
                    total={lecture.studentCount ?? 0}
                  />
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
