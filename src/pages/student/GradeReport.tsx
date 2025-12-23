import { useState } from "react";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import LectureList from "../../components/common/student/LectureList";
import AttendanceCalendar from "../../components/common/student/AttendanceCalendar";
import AttendanceCompareChart from "../../components/common/student/AttendanceChart";
import ScoreDonut from "../../components/common/student/ScoreDonut";
import { useParams } from "react-router-dom";
import useMyLectures from "../../hooks/student/useMyLectures";
import {
  useGetLectureAverageScores,
  useGetMonthlyAttendance,
  type MyLectureResponse,
} from "../../api/generated/edutrack";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import UnitScoreChart from "../../components/charts/UnitScoreChart";
import { useLectureUnitAvgScores } from "../../hooks/student/useAllUnitRates";
import { useStudentLectureUnitScores } from "../../hooks/student/useMyUnitRates";

export default function GradeReport() {
  const auth = useRecoilValue(authState);
  const studentId = auth.user?.id;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const { lectureId } = useParams();
  const [clickedLecture, setClickedLecture] =
    useState<MyLectureResponse | null>(null);
  const selectedLectureId = clickedLecture?.lectureId ?? Number(lectureId);

  const { lectures } = useMyLectures();

  const selectedLecture =
    clickedLecture ||
    lectures.find((l) => l.lectureId === Number(lectureId)) ||
    null;

  const { data: monthlyAttendance } = useGetMonthlyAttendance(
    studentId!,
    selectedLectureId,
    { year, month }
  );

  const myLectureAvg = useGetLectureAverageScores(studentId, selectedLectureId);

  const lectureAvg = useLectureUnitAvgScores(selectedLectureId);

  const myUnitScores = useStudentLectureUnitScores({
    studentId,
    unitIds: lectureAvg.unitIds,
    labels: lectureAvg.scores.map((s) => s.label),
  });

  const avgQuery = useGetLectureAverageScores(
    studentId ?? 0,
    selectedLectureId,
    {
      query: {
        enabled: !!studentId && selectedLectureId > 0,
        retry: false,
      },
    }
  );

  const status = avgQuery.error?.response?.status;
  const noData = status === 404;

  return (
    <Page>
      <div className="space-y-4">
        <PageTitle title="성적 조회" />
        <Card title="강의 리스트">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lectures.map((lecture) => (
              <LectureList
                thumbnail={lecture.imageUrl}
                key={lecture.lectureId}
                name={lecture.lectureTitle ?? "강의명 없음"}
                onClick={() => setClickedLecture(lecture)}
                variant="compact"
              >
                <span className="text-xs mr-4">
                  {lecture.teacherName} 강사님
                </span>
              </LectureList>
            ))}
          </div>
        </Card>

        <Card title={auth.user?.name ?? ""}>
          {!selectedLecture && (
            <p className="text-gray-400">
              강의를 선택하면 성적 리포트가 표시됩니다.
            </p>
          )}

          {selectedLecture && (
            <section className="space-y-4">
              <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="relative text-sm h-10 flex items-center justify-center">
                  <span className="font-semibold absolute left-7">강의명</span>
                  <span className="">{selectedLecture.lectureTitle}</span>
                </Card>
                <Card className="relative text-sm h-10 flex items-center justify-center">
                  <span className="font-semibold absolute left-7">강사명</span>
                  {selectedLecture.teacherName} 강사님
                </Card>
              </article>

              <Card title="출석률">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                      이번 달 출석 현황
                    </h3>
                    <AttendanceCalendar
                      attendedDates={
                        monthlyAttendance?.data.attendedDates ?? []
                      }
                      totalClassDays={monthlyAttendance?.data.totalClassDays}
                      year={year}
                      month={month}
                      className="text-center"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                      다른 수강생의 평균 출석률
                    </h3>
                    <AttendanceCompareChart
                      myRate={monthlyAttendance?.data.attendanceRate ?? 0}
                      classRate={
                        monthlyAttendance?.data
                          .otherStudentsAvgAttendanceRate ?? 0
                      }
                    />
                  </div>
                </div>
              </Card>
              <Card title="평균 성적">
                {avgQuery.isLoading ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    불러오는 중...
                  </p>
                ) : noData ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    아직 평균을 계산할 시험/과제 데이터가 없습니다.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-12">
                    <div className="flex justify-center">
                      <ScoreDonut
                        title="전체 시험 평균"
                        score={avgQuery.data?.data?.examAverageGrade ?? 0}
                      />
                    </div>

                    <div className="flex justify-center">
                      <ScoreDonut
                        title="전체 과제 평균"
                        score={avgQuery.data?.data?.assignmentAverageScore ?? 0}
                      />
                    </div>
                  </div>
                )}
              </Card>

              <Card title="단원별 정답률">
                <div className="grid grid-cols-2 gap-12 m-2">
                  <UnitScoreChart
                    title="나의 단원별 정답률"
                    scores={myUnitScores.scores}
                  />
                  <UnitScoreChart
                    title="수강생 전체 단원별 평균 정답률"
                    scores={lectureAvg.scores}
                  />
                </div>
              </Card>
            </section>
          )}
        </Card>
      </div>
    </Page>
  );
}
