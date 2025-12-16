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
  useGetMonthlyAttendance,
  type MyLectureResponse,
} from "../../api/generated/edutrack";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";

export default function GradeReport() {
  const auth = useRecoilValue(authState);
  const studentId = auth.user?.id;
  const maxScore = 100;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const { lectureId } = useParams();
  const [clickedLecture, setClickedLecture] =
    useState<MyLectureResponse | null>(null);

  const { lectures, isError } = useMyLectures();

  const selectedLecture =
    clickedLecture ||
    lectures.find((l) => l.lectureId === Number(lectureId)) ||
    null;

  const { data: monthlyAttendance } = useGetMonthlyAttendance(
    studentId!,
    selectedLecture!.lectureId!,
    { year, month },
    { query: { enabled: !!studentId && !!selectedLecture } }
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

        <Card title="김민경학생의 성적 리포트">
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

              <Card title="평균 성적">
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
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                      수강생 전체 단원별 정답률
                    </h3>
                    <div className="flex items-end justify-center gap-3 h-44">
                      {mockUnitScores.map((score, index) => (
                        <div
                          key={index}
                          className="w-10 bg-blue-400 rounded-t transition-all hover:bg-blue-500"
                          style={{ height: `${(score / maxScore) * 160}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                      다른 강의평균 성적
                    </h3>
                    <div className="flex items-end justify-center gap-3 h-44">
                      {mockMyScores.map((score, index) => (
                        <div
                          key={index}
                          className="w-10 bg-blue-400 rounded-t transition-all hover:bg-blue-500"
                          style={{ height: `${(score / maxScore) * 160}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          )}
        </Card>
      </div>
    </Page>
  );
}
