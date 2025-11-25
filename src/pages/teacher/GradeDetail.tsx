import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import LectureHeader from "../../components/common/LectureHeader";
import CircleProgress from "../../components/common/CircleProgress";
import StatBox from "../../components/common/StatBox";

const mockLecture = {
  id: 1,
  name: "재미있는 영어",
  level: "초등 저학년",
  description: "초등 저학년도 재미있게 배울 수 있는 영어 강의!",
  thumbnail: "/images/lecture-thumbnail.png",
};

const mockStats = {
  attendanceRate: 60,
  averageScore: 80,
  totalScore: 100,
  topAverage: 10,
};

const mockUnitScores = [20, 55, 50, 45, 70, 80, 30, 15];
const mockOtherLectureScores = [10, 75, 50, 55, 70, 65];

export default function GradeDetail() {
  const maxScore = 100;

  return (
    <Page>
      <div className="space-y-8">
        <Card>
          <LectureHeader
            name={mockLecture.name}
            level={mockLecture.level}
            description={mockLecture.description}
            thumbnail={mockLecture.thumbnail}
          />
        </Card>

        <Card title="강의 종합 분석">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="출석률">
              <CircleProgress value={mockStats.attendanceRate} />
            </StatBox>

            <StatBox label="통합 평균 성적">
              <span className="text-lg font-semibold text-gray-900">
                {mockStats.averageScore} / {mockStats.totalScore}
              </span>
            </StatBox>

            <StatBox label="상위 평균">
              <span className="text-lg font-semibold text-gray-900">
                {mockStats.topAverage}%
              </span>
            </StatBox>
          </div>
        </Card>

        <Card>
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
                {mockOtherLectureScores.map((score, index) => (
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
      </div>
    </Page>
  );
}
