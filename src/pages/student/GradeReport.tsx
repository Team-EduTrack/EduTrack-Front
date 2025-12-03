import { useState } from "react";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import LectureList from "../../components/common/student/LectureList";
import AttendanceCalendar from "../../components/common/student/AttendanceCalendar";
import AttendanceCompareChart from "../../components/common/student/AttendanceChart";
import ScoreDonut from "../../components/common/student/ScoreDonut";

interface Lecture {
  id: number;
  name: string;
  teacher: string;
}

const mockLectures = [
  {
    id: 1,
    name: "영문법 특강",
    teacher: "김은아",
  },
  {
    id: 2,
    name: "재미있는 영어",
    teacher: "김남규",
  },
  {
    id: 3,
    name: "중학 내신 특강",
    teacher: "박상기",
  },
  {
    id: 4,
    name: "즐거운 알파벳",
    teacher: "이은경",
  },
  {
    id: 5,
    name: "보카 독파",
    teacher: "박상기",
  },
  {
    id: 6,
    name: "리딩 바이트",
    teacher: "김은아",
  },
];

const attendanceData: Record<string, "present" | "absent"> = {
  "2025-12-01": "present",
  "2025-12-02": "absent",
  "2025-12-03": "present",
  "2025-12-04": "present",
};

const mockUnitScores = [20, 55, 50, 45, 70, 80, 30, 15];
const mockMyScores = [10, 75, 50, 55, 70, 65];

export default function GradeReport() {
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const maxScore = 100;

  return (
    <Page>
      <div className="space-y-4">
        <PageTitle title="성적 조회" />
        <Card title="강의 리스트">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLectures.map((lecture) => (
              <LectureList
                key={lecture.id}
                name={lecture.name}
                onClick={() => setSelectedLecture(lecture)}
                variant="compact"
              >
                <span className="text-xs mr-4">{lecture.teacher} 강사님</span>
              </LectureList>
            ))}
          </div>
        </Card>

        <Card title="김민경 학생의 성적 리포트">
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
                  <span className="">{selectedLecture.name}</span>
                </Card>
                <Card className="relative text-sm h-10 flex items-center justify-center">
                  <span className="font-semibold absolute left-7">강사명</span>
                  {selectedLecture.teacher} 강사님
                </Card>
              </article>

              <Card title="평균 성적">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                      이번 달 출석 현황
                    </h3>
                    <AttendanceCalendar
                      attendance={attendanceData}
                      className="text-center"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                      다른 수강생의 평균 출석률
                    </h3>
                    <AttendanceCompareChart myRate={92} classRate={85} />
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
