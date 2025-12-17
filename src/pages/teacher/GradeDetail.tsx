import { useParams } from "react-router-dom";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import LectureHeader from "../../components/common/LectureHeader";
import CircleProgress from "../../components/common/CircleProgress";
import StatBox from "../../components/common/StatBox";
import {
  useLectureDetail,
  useUnitRates,
} from "../../hooks/teacher";

export default function GradeDetail() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const lectureIdNum = Number(lectureId);

  const { lectureDetail, statistics, isLoading, isError } =
    useLectureDetail(lectureIdNum);
  const { unitCorrectRates, isLoading: isLoadingRates } =
    useUnitRates(lectureIdNum);

  if (isLoading || isLoadingRates) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Page>
    );
  }

  if (isError || !lectureDetail) {
    return (
      <Page>
        <Card>
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        </Card>
      </Page>
    );
  }

  const attendanceRate = statistics?.attendanceRate ?? 0;
  const averageScore = statistics?.averageScore ?? 0;
  const top10PercentScore = statistics?.total10PercentScore ?? 0;
  const maxScore = 100;

  return (
    <Page>
      <div className="space-y-8">
        <Card>
          <LectureHeader
            name={lectureDetail.title ?? ""}
            level=""
            description={lectureDetail.description ?? ""}
          />
        </Card>

        <Card title="강의 종합 분석">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="출석률">
              <CircleProgress value={Math.round(attendanceRate)} />
            </StatBox>

            <StatBox label="통합 평균 성적">
              <span className="text-lg font-semibold text-gray-900">
                {averageScore.toFixed(1)}점
              </span>
            </StatBox>

            <StatBox label="상위 10% 평균">
              <span className="text-lg font-semibold text-gray-900">
                {top10PercentScore.toFixed(1)}점
              </span>
            </StatBox>
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-1 gap-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
                수강생 전체 단원별 정답률
              </h3>
              {unitCorrectRates.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  아직 데이터가 없습니다.
                </p>
              ) : (
                <div className="flex items-end justify-center gap-3 h-44">
                  {unitCorrectRates.map((unit, index) => {
                    const rate = unit.correctRate ?? 0;
                    return (
                      <div key={unit.unitId ?? index} className="flex flex-col items-center">
                        <div
                          className="w-10 bg-blue-400 rounded-t transition-all hover:bg-blue-500"
                          style={{ height: `${(rate / maxScore) * 160}px` }}
                        />
                        <span className="text-xs text-gray-500 mt-2">
                          {index + 1}단원
                        </span>
                        <span className="text-xs text-gray-700 font-medium">
                          {rate.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 추가 통계 정보 */}
        <Card title="강의 통계 상세">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">수강생 수</p>
              <p className="text-xl font-semibold text-gray-900">
                {statistics?.studentCount ?? 0}명
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">출석률</p>
              <p className="text-xl font-semibold text-gray-900">
                {attendanceRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">과제 제출률</p>
              <p className="text-xl font-semibold text-gray-900">
                {(statistics?.assignmentSubmissionRate ?? 0).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">시험 응시율</p>
              <p className="text-xl font-semibold text-gray-900">
                {(statistics?.examParticipationRate ?? 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}
