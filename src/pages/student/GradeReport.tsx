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
  useGetLectureUnitCorrectRates,
  useGetMonthlyAttendance,
  useGetWeakUnits,
  type MyLectureResponse,
} from "../../api/generated/edutrack";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import UnitScoreChart from "../../components/charts/UnitScoreChart";

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

  const { data: weakUnitsRes } = useGetWeakUnits(studentId!, { limit: 8 });
  const weakUnits = weakUnitsRes?.data ?? [];
  const { data: lectureAvgRes } =
    useGetLectureUnitCorrectRates(selectedLectureId);
  const lectureAvgUnits = lectureAvgRes?.data ?? [];

  const avgRateByUnitId = new Map(
    lectureAvgUnits
      .filter((u) => u.unitId != null)
      .map((u) => [u.unitId as number, u.correctRate ?? 0])
  );

  return (
    <Page>
      <div className="space-y-4">
        <PageTitle title="성적 조회" />
        <Card title="강의 리스트">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lectures.map((lecture) => (
              <LectureList
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
                <div className="grid grid-cols-2 gap-12 ">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                      <ScoreDonut score={87} />
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6"></h3>
                  </div>
                </div>
              </Card>

              <Card title="단원별 정답률">
                <div className="grid grid-cols-2 gap-12 ">
                  <UnitScoreChart
                    title="나의 단원별 정답률"
                    scores={
                      weakUnits?.map((u) => ({
                        value: u.correctRate ?? 0,
                      })) ?? []
                    }
                  />

                  <UnitScoreChart
                    title="수강생 전체 단원별 평균"
                    scores={weakUnits
                      .filter((u) => u.unitId != null)
                      .map((u) => ({
                        value: avgRateByUnitId.get(u.unitId as number) ?? 0,
                      }))}
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
