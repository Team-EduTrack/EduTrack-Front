import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import TaskCard from "../../components/common/student/TaskCard";

import useMyLectures from "../../hooks/student/useMyLectures";
import useMyExams from "../../hooks/student/useMyExams";

import { mapExam } from "../../utils/mappers/examMapper";

export default function LectureTasks() {
  const { lectures, isLoading: isLectureLoading } = useMyLectures();
  const { exams, isLoading: isExamLoading } = useMyExams();

  if (isLectureLoading || isExamLoading) {
    return (
      <Page>
        <PageTitle title="과제 / 시험 제출" />
        <p className="mt-6 text-center">불러오는 중…</p>
      </Page>
    );
  }

  return (
    <Page>
      <div className="space-y-6">
        <PageTitle title="과제 / 시험 제출" />

        <Card className="space-y-4">
          {lectures.map((lecture) => {
            const examsForLecture = exams
              .filter((exam) => exam.lectureTitle === lecture.lectureTitle)
              .map(mapExam);

            return (
              <TaskCard
                key={lecture.lectureId}
                lecture={{
                  id: lecture.lectureId!,
                  title: lecture.lectureTitle ?? "",
                  teacher: lecture.teacherName ?? "",
                }}
                //assignments={[]} // 과제는 TaskCard 내부에서 fetch (자동)
                exams={examsForLecture}
              />
            );
          })}
        </Card>
      </div>
    </Page>
  );
}
